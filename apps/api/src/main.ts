import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import { clerkMiddleware } from '@clerk/express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === 'production';

  // Ensure Nest registers OS signal listeners so lifecycle hooks are called
  // (e.g., PrismaService.onApplicationShutdown → this.$disconnect())
  app.enableShutdownHooks();

  const helmetOptions: Parameters<typeof helmet>[0] = {
    // Strict CSP for the API; Swagger (/api/docs) is excluded below
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        // Enables automatic upgrade of http:// to https:// on supported browsers
        // (expressed as presence-only directive; empty array is how helmet enables it)
        upgradeInsecureRequests: [],
      },
    },
    // Only enable HSTS when running behind HTTPS (typically in production)
    hsts: isProd
      ? {
          maxAge: 15552000, // 180 days
          includeSubDomains: true,
          preload: true,
        }
      : false,
    referrerPolicy: { policy: 'no-referrer' },
  };

  // Apply Helmet to all routes except Swagger docs under /api/docs
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/docs')) {
      return next();
    }
    return helmet(helmetOptions)(req, res, next);
  });
  app.enableCors();
  app.setGlobalPrefix('api');

  app.use(
    clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLIC_KEY,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration enabled only outside production
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('IWords Learning App API')
      .setDescription('API for the IWords Learning Application')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'admin-auth',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'app-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Graceful shutdown on common termination signals
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal as NodeJS.Signals, () => {
      // Avoid returning a Promise from the event listener to satisfy lint rule
      void app.close().catch((e) => {
        console.error('Error during graceful shutdown:', e);
      });
    });
  });

  await app.listen(process.env.PORT ?? 3003);
}

bootstrap().catch((err) => console.error(err));
