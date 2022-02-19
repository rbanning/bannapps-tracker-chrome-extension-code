import { TrackerService } from "./tracker.service";

export class PopupComponent {


  run() {
    document.addEventListener('DOMContentLoaded', async () => {
      const result = await this.SayHello('Rob');
      console.log("DEBUG: say hello", result);
      const trackerService = new TrackerService();
      trackerService.getAll()
        .then(results => {
          console.log("DEBUG: tracker records", results);
        });
    });
  }

  private async SayHello(name: string = 'Jane') {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolve(`Hello ${name || 'unknown'}!  Glad you made it PAL`);
      }, 2000);
    });
  }
}

const pop = new PopupComponent();
pop.run();
