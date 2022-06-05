import { Inject, Service } from '@pv/di'
import { MessageBoxService } from '@pv/modules/message-box'
import { t } from '@pv/interface/services/i18n'
import { SettingsAdapter } from '../../infra/settings.adapter'

@Service()
export class DropAllService {
  constructor(
    @Inject()
    private messageBoxService: MessageBoxService,
    @Inject()
    private settingsAdapter: SettingsAdapter,
  ) {}

  async dropData() {
    const isConfirmed = await this.messageBoxService.confirm(t('settings.sureDrop'))
    if (!isConfirmed) return

    const result = await this.settingsAdapter.dropData()
    if (result.isErr()) {
      //TODO: add error processing
    }
  }
}
