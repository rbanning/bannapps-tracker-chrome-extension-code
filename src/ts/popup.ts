import { TrackerService } from "./tracker.service";

export class PopupComponent {
  run() {
    document.addEventListener("DOMContentLoaded", async () => {
      const result = await this.SayHello();
      console.log("DEBUG: say hello", result);

      chrome.runtime.sendMessage(
        { id: "page-meta" },
        (response) => {
          console.log("DEBUG: Response from BG.page-meta", response);
        }
      );

      // const trackerService = new TrackerService();
      // await trackerService.getAll()
      //   .then(results => {
      //     console.log("DEBUG: tracker records", results);
      //     chrome.runtime.sendMessage(
      //       {id: 'badge-text', text: `${results.length}`},
      //       response => {
      //         console.log("DEBUG: Response from BG", response);
      //       });
      //   })
      //   .catch(error => {
      //     console.warn("DEBUG tracker records failed", error);
      //   })
    });
  }

  private async SayHello() {
    return new Promise(async (resolve, reject) => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("DEBUG: SayHello", tab);
      resolve(
        `Hello ${tab.title || "unknown"}, url is [${tab.url || "no url"}]`
      );
    });
  }
}

const pop = new PopupComponent();
pop.run();
