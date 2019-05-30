var fs = require('fs');
var xml2js = require('xml2js')
var createHTML = require('create-html')
var data = require('../client/data')

var prodUrl = 'http://volontiers.fr/'
var baseUrl = '../dist/snapshots/'
const tt = (duration = 0) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration)
    })
}

const writeFile = (filepath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, content, (err) => {
            if (err) return reject
            resolve()
        })
    })
}
const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) return reject
            resolve(data)
        })
    })
}
const createDir = (url) => {
    return new Promise((resolve, reject) => {
        fs.stat(url, () => {
            fs.mkdir(url, resolve)
        })
    })
}
const parseXml = (data) => {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser()
        parser.parseString(data, (err, result) => {
            if (err) return reject
            var locations = result['urlset']['url']
            resolve(locations)
        })
    })
}

const createHtml = (id, url, siteLinks) => {
    return new Promise((resolve, reject) => {
        const scope = data.projects[id]
        const uri = `${url}/index.html`
        const html = createHTML({
            title: `VOLONTIERS – ${scope.brand.toUpperCase()} – ${scope.project.toUpperCase()}`,
            head: `
                <meta name="keywords" content="event, paris, production, set design, événement, design, agence, display, scénographie, agencement">
                <meta name="author" content="Volontiers">
                <meta name="copyright" content="© Copyright 2019 - Volontiers" />
                <meta name="location" content="Paris, FRANCE">
                <base href="/">

                <!-- Favicon -->
                <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
                <link rel="icon" type="image/png" href="/assets/favicon/favicon-32x32.png" sizes="32x32">
                <link rel="icon" type="image/png" href="/assets/favicon/favicon-16x16.png" sizes="16x16">
                <link rel="manifest" href="/assets/favicon/manifest.json">
                <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#000000">
                <link rel="shortcut icon" href="/assets/favicon/favicon.ico">
                <meta name="msapplication-config" content="/assets/favicon/browserconfig.xml">
                <meta name="theme-color" content="#ffffff">

                <!-- Facebook meta -->
                <meta property="og:title" content="VOLONTIERS"/>
                <meta property="og:type" content="website">
                <meta property="og:image" content="http://volontiers.fr/assets/social.jpg"/>
                <meta property="og:url" content="http://volontiers.fr"/>
                <meta property="og:description" content="VOLONTIERS conceives and produces original, aesthetic and unforgettable events.">
                <meta property="og:site_name" content="VOLONTIERS - Design and Production agency"/>

                <!-- Twitter meta -->
                <meta name="twitter:card" content="summary">
                <meta name="twitter:site" content="@">
                <meta name="twitter:creator" content="@convoystudio">
                <meta name="twitter:title" content="VOLONTIERS - Retail and Event agency">
                <meta name="twitter:description" content="VOLONTIERS conceives and produces original, aesthetic and unforgettable events.">
                <meta name="twitter:image:src" content="http://volontiers.fr/assets/social.jpg">

                <!-- GOOGLE + Share -->
                <meta itemprop="name" content="VOLONTIERS - Retail and Event agency">
                <meta itemprop="description" content="VOLONTIERS conceives and produces original, aesthetic and unforgettable events.">
                <meta itemprop="image" content="http://volontiers.fr/assets/social.jpg">
            `,
            body: `
                <div id="header">
                    <h1>DESIGN &amp; PRODUCTION</h1>
                    <div id="logo"><img src="http://volontiers.fr/assets/social.jpg" /></div>
                </div>
                <div id="nav">
                    <ul>
                        ${siteLinks.map((link) => { return ( `<li><a href='${link.uri}'>${link.title}</a></li>` ) })}
                    </ul>
                </div>
                <div id="article">
                    <h2>${scope.brand.toUpperCase()} – ${scope.project.toUpperCase()}</h2>
                    <p>${scope.about.en}</p>
                    <p>${scope.about.fr}</p>
                    <ul>
                        ${scope.assets.map((asset) => {
                            if (asset.indexOf('mp4') > -1) {
                                return `
                                    <li>
                                        <video width="400" controls>
                                            <source src="${prodUrl}assets/images/${id}/${asset}" type="video/mp4">
                                            Your browser does not support HTML5 video.
                                        </video>
                                    </li>
                                `
                            } else {
                                return `<li><img src="${prodUrl}assets/images/${id}/${asset}" /></li>`
                            }
                        })}
                    </ul>
                </div>
                <div id="footer">
                    <h3>${data.content.en.navigation.about} / ${data.content.fr.navigation.about}</h3>
                    <p>${data.content.en.about.text}</p>
                    <p>${data.content.fr.about.text}</p>
                </div>
            `
        })
        fs.writeFile(uri, html, (err) => {
            if (err) console.log(reject)
            resolve()
        })
    })
}

(async () => {
    await createDir(baseUrl)
    await createDir(`${baseUrl}project`)
    await createDir(`${baseUrl}home`)
    const xmlData = await readFile('../static/sitemap.xml')
    const locations = await parseXml(xmlData)
    const urls = locations.map((location) => {
        const pageUrl = location.loc[0].split(prodUrl)[1]
        const id = pageUrl.split('/')[1]
        const uri = `${prodUrl}${pageUrl}`
        const scope = data.projects[id]
        const title = `${scope.brand.toUpperCase()} – ${scope.project.toUpperCase()}`
        return { uri, title }
    })
    await Promise.all(locations.map(async (location) => {
        const pageUrl = await location.loc[0].split(prodUrl)[1]
        const subfolder = await pageUrl.split('/')[0]
        const id = await pageUrl.split('/')[1]
        await createDir(`${baseUrl}${subfolder}/${id}`)
        await createHtml(id, `${baseUrl}${subfolder}/${id}`, urls)
    }));
})()
