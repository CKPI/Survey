{

  cms: {
    alias: 'survey',
    url: 'mongodb://127.0.0.1:27017/survey',
    slowTime: '2s'
  },

  gs: {
    alias: 'gs',
    url: 'gs://metarhia.com/',
    storage: 'cms',
    security: true
  }

}
