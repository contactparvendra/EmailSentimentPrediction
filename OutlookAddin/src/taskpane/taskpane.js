/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    //document.getElementById("run").onclick = run;
    run();
  }
});
function showsentiment(sentiment) {
  if (sentiment == "negative") {
    sentiment = "sad";
  } else if (sentiment == "positive") {
    sentiment = "happy";
  } else {
    sentiment = "neutral";
  }
  document.getElementById("app-message").innerHTML = "The Sender is " + sentiment;
  document.getElementById("sentiment-img").src = "../../assets/" + sentiment + ".png";
  document.getElementById("sentiment-img").style.visibility = "visible";
  document.getElementById("run").innerHTML = "";
}
export async function run() {
  /**
   * Insert your Outlook code here
   */

  if (Office.context.mailbox.item.body.getAsync !== undefined) {
    showsentiment("neutral");
    Office.context.mailbox.item.body.getAsync("text", function (asyncResult) {
      var bodyText = asyncResult.value;
      const formData = new FormData();
      formData.append("t", bodyText);
      const Http = new XMLHttpRequest();
      const url = "http://127.0.0.1:5000/sentiment";
      Http.open("POST", url);
      Http.setRequestHeader("origin", "https://localhost:3000");
      Http.send(formData);
      Http.onload = () => {
        showsentiment(Http.responseText);
      }

    });
  } else {
    // Method not available
    document.getElementById("item-body").innerHTML =
      "<b>Body:</b> <br/>" +
      "The body.getAsync() method is not available in this version of Outlook. Body parsing was skipped";
  }
}
