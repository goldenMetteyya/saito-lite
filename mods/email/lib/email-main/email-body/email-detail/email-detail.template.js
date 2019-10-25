module.exports = EmailDetailTemplate = (selected_mail) => {
  let { from, to, ts } = selected_mail.transaction;
  let { message } = selected_mail.returnMessage();

  let datetime = new Date(ts);
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;

  return `
    <div>
      <div class="email-detail-addresses">
        <div class="email-detail-address-row">
          <p>FROM:</p>
          <p class="email-detail-address-id">${from[0].add}</p>
        </div>
        <div class="email-detail-address-row">
          <p>TO:</p>
          <p class="email-detail-address-id">${to[0].add}</p>
        </div>
      </div>
      <div class="email-detail-message">
        <p class="email-detail-timestamp">${hours}:${minutes}</p>
        <p>${message}</p>
      </div>
    </div>
  `;
}