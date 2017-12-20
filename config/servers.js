{

  master: {
    protocol:  'jstp',
    transport: 'tcp',
    address:   '127.0.0.1',
    ports:     [250],
    slowTime:  '1s'
  },

  www: {
    protocol:  'http',
    transport: 'tcp',
    address:   '*',
    ports:     [80],
    slowTime:  '1s',
    timeout:   '30s',
    keepAlive: '5s',
    applications: ['Survey']
  },

  rpc: {
    protocol:  'jstp',
    transport: 'tcp',
    address:   '*',
    ports:     [81],
    applications: ['Survey'],
    heartbeat: '2s'
  }

}
