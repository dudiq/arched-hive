import 'reflect-metadata'
import { MainModule } from '@pv/modules/main'

const instance = MainModule.getInstance()

instance.start()
