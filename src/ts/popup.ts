import { IPageMeta } from "./page-meta.model";
import { sendMessageAsPromise } from "./send-message-as-promise";
import { ISettings } from "./settings.model";
import { SettingsService } from "./settings.service";
import { ITracker } from "./tracker.model";
import { TrackerService } from "./tracker.service";

type AreaElements = {[key: string]: HTMLElement};
type InputElements = {[key: string]: HTMLInputElement};
type ButtonElements = {[key: string]: HTMLButtonElement};

export class PopupComponent {
  private readonly MESSAGE_KEY = 'page-meta';
  areas: AreaElements = {};
  fields: InputElements = {};
  buttons: ButtonElements = {};
  domains: string[] = [];
  meta: IPageMeta;


  init() {
    document.addEventListener("DOMContentLoaded", async () => {
      this.refresh();
    });
  }

  refresh() {
    this.setWorking(true);
    const actions = [
      this.getSettings(),
      sendMessageAsPromise(this.MESSAGE_KEY)
    ];
    Promise.all(actions)
      .then(([settings, pageMeta]: [ISettings, IPageMeta]) => {
        this.domains = settings?.domains;
        this.meta = pageMeta;
        const trackerService = new TrackerService();
        return trackerService.getAllForSingleDomain(pageMeta?.domain);
      })
      .then((records: ITracker[]) => this.loadRecords(records))
      .finally(() => this.setWorking(false));
  }

  private loadRecords(records: ITracker[]) {
    //todo: implement loadRecords
  }
  private async getSettings() {
    const settingsService = new SettingsService();
    return await settingsService.refresh()
      .then((settings: ISettings) => {
        return settings;
      });
  }

  private setWorking(state: boolean) {
    if (this.areas.working) {
      this.areas.working.classList.toggle('show', state);
      Object.keys(this.buttons).forEach(key => {
        if (this.buttons[key]) {
          this.buttons[key].disabled = state;
        }
      });
    }
  }

  
}

const pop = new PopupComponent();
pop.init();
