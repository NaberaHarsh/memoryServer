module.exports=({count,image,title,description})=>{
    return`
    <doctype html>
    <html>
        <head>
            <title>pdf data</title>
        </head>
        <body>
            <h1>${title}</h1>
            <h1>${description}</h1>
            <img src="${image}" />
            <h2>${count}</h2>
        </body>
    </html>
`
};