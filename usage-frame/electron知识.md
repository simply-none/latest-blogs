# electron

命令行：
```js
app.commandLine.appendSwitch('--disable-http-cache')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('ignore-certificate-errors')
```