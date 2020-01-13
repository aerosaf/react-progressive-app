self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('New notification', data);
  event.waitUntil(
    self.registration.showNotification(data.title, data)
  );
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('https://webapp.gem.live/notifications');
    }
  }));
});
