import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { HttpExceptionResponse } from '../interfaces/http-exception-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const typedResponse = exceptionResponse as HttpExceptionResponse;
        message = typedResponse.message || exception.message;
        details = typedResponse.details || typedResponse.error;
      } else {
        message = exception.message;
      }
    }
    // Handle Prisma Known Request Errors (P2xxx codes)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      const result = this.handlePrismaKnownError(exception);
      message = result.message;
      details = result.details;
    }
    // Handle Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid query parameters';
      this.logger.error(`Prisma validation error: ${exception.message}`);
    }
    // Handle Prisma Initialization Errors
    else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection failed';
      this.logger.error(`Prisma initialization error: ${exception.message}`);
    }
    // Handle all other errors
    else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      this.logger.error(`Unknown exception type: ${String(exception)}`);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.path,
        method: request.method,
        ...(details ? { details } : {}),
        ...(process.env.NODE_ENV === 'development' && exception instanceof Error && exception.stack
          ? { stack: exception.stack }
          : {}),
      },
    };

    this.logger.error(
      `${request.method} ${request.path} - Status: ${status} - Message: ${message}`,
    );

    response.status(status).json(errorResponse);
  }

  private handlePrismaKnownError(exception: Prisma.PrismaClientKnownRequestError): {
    message: string;
    details?: Record<string, unknown>;
  } {
    switch (exception.code) {
      // Unique constraint violation
      case 'P2002': {
        const meta = exception.meta as { target?: unknown } | undefined;
        const target = Array.isArray(meta?.target) ? meta.target : [];
        return {
          message: `A record with this ${target.join(', ')} already exists`,
          details: {
            fields: target,
          },
        };
      }

      // Record not found
      case 'P2025':
        return {
          message: 'Record not found',
        };

      // Foreign key constraint failed
      case 'P2003': {
        const meta = exception.meta as { field_name?: unknown } | undefined;
        return {
          message: 'Related record not found',
          details: {
            field: meta?.field_name,
          },
        };
      }

      // Required field missing
      case 'P2011': {
        const meta = exception.meta as { constraint?: unknown } | undefined;
        return {
          message: 'Required field is missing',
          details: {
            constraint: meta?.constraint,
          },
        };
      }

      // Failed to validate constraint
      case 'P2014': {
        const meta = exception.meta as { relation_name?: unknown } | undefined;
        return {
          message: 'The change would violate a required relation',
          details: {
            relation: meta?.relation_name,
          },
        };
      }

      // Record required but not found
      case 'P2015':
        return {
          message: 'Related record not found',
        };

      // Query interpretation error
      case 'P2016':
        return {
          message: 'Query interpretation error',
        };

      // Records for relation not connected
      case 'P2017': {
        const meta = exception.meta as { relation_name?: unknown } | undefined;
        return {
          message: 'Related records are not connected',
          details: {
            relation: meta?.relation_name,
          },
        };
      }

      // Required connected records not found
      case 'P2018':
        return {
          message: 'Required connected records not found',
        };

      // Input error
      case 'P2019':
        return {
          message: 'Input error',
        };

      // Value out of range
      case 'P2020':
        return {
          message: 'Value out of range for the field type',
        };

      // Table does not exist
      case 'P2021':
        return {
          message: 'The table does not exist in the database',
        };

      // Column does not exist
      case 'P2022':
        return {
          message: 'The column does not exist in the database',
        };

      // Inconsistent column data
      case 'P2023':
        return {
          message: 'Inconsistent column data',
        };

      // Timed out fetching from connection pool
      case 'P2024':
        return {
          message: 'Database query timed out',
        };

      // Default - for any other Prisma error codes
      default:
        this.logger.error(`Unhandled Prisma error code: ${exception.code}`);
        return {
          message: 'Database operation failed',
          details: {
            code: exception.code,
          },
        };
    }
  }
}
