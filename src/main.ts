import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ThrowIfNullInterceptor } from 'src/common/interceptors/throw-if-null.interceptor'

const DEFAULT_HOSTNAME = 'localhost'
const DEFAULT_PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new ThrowIfNullInterceptor())
  await app.listen(process.env.PORT ?? DEFAULT_PORT, process.env.HOSTNAME ?? DEFAULT_HOSTNAME)
}

void bootstrap()
