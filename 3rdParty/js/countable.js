//default values
// const defaultOptions = {
//     countable: true,
//     position: "top",
//     margin: "10px",
//     float: "right",
//     fontsize: "0.9em",
//     color: "rgb(90,90,90)",
//     language: "english",
//     isExpected: true,
// }

// Docsify plugin functions
function plugin(hook, vm) {
    if (!defaultOptions.countable) {
        return
    }
    let wordsCount
    hook.beforeEach(function (content) {
        // Match regex every time you start parsing .md
        wordsCount = content.match(/([\u4e00-\u9fa5]+?|[a-zA-Z0-9]+)/g).length
        return content
    })
    hook.afterEach(function (html, next) {
        let str = wordsCount + " words"
        let readTime = Math.ceil(wordsCount / 400) + " min"
        //Determine whether to use the Chinese style according to the attribute "language"
        if (defaultOptions.language === "chinese") {
            str = wordsCount + " 字"
            readTime = Math.ceil(wordsCount / 400) + " 分钟"
        }

        //add html string
        next(
            `
        <div style="margin-top: 10px !important; position: absolute; top: 0; right: 0; padding-top: 30px; color: #c8c8c8;">
            <span style="
                  float: 'right';
                  font-size: '0.9em';
                  color:'rgb(90,90,90)'">
            ${str}
            ${defaultOptions.isExpected ? `&nbsp; | &nbsp;${readTime}` : ""}
            </span>
            <div style="clear: both"></div>
        </div>
        ${html}
        `
        )
    })
}

// Docsify plugin options
window.$docsify["count"] = Object.assign(
    defaultOptions,
    window.$docsify["count"]
)
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins)
