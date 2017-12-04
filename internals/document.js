const config = require('../config/config')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = version => content => {
  return `<!doctype html>
<html data-version="${version}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, initial-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta httpEquiv="x-ua-compatible" content="IE=edge" />
		<link href="https://fonts.googleapis.com/css?family=Fira+Mono" rel="stylesheet">
    ${insertCSS()}
  </head>
  <body>
    <div id="app" class="thunderbox" />
    <script src="/public/vendor.js"></script>
    <script src="/public/app.js"></script>
    ${insertGA()}
  </body>
</html>`
}

const insertCSS = () => {
  return isProduction ?
    `<link href="/public/client.css" rel="stylesheet" type="text/css" />` :
    ''
}

const insertGA = () => {
  return `
    <script type="text/javascript">
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', '${config.analytics.gaId}', 'auto', '${config.analytics.gaLabel}');
    </script>`
}
