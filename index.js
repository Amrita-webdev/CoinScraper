const PORT = process.env.PORT || 5500
const axios = require('axios')
const cheerio = require('cheerio')
const { json } = require('express')
const express = require('express')
const cors = require('cors')
const bodyparser= require ('body-parser')
const logger = require('morgan')

async function getPriceFeed(){
    try{
        const siteUrl='https://coinmarketcap.com/'

        const { data } = await axios({
            method: "GET",
            url: siteUrl,

        })
        const $ =cheerio.load(data)
        const elemSelecter = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'


        const keys = [
            'Rank',
            'Name',
            'Price',
            '24hrChange',
            '7dChange',
            'MarketCap',
            'Volume',
            'CirculatingSupply'
        ]
        const coinArr=[]


        $(elemSelecter).each((parentIdx, parentElem)=>{
            let keyIdx=0
            const coinObj={}

            if (parentIdx<= 9){
                $(parentElem).children().each((childIdx, childElem)=>{
                    let tdValue=$(childElem).text()
                    if (keyIdx===1 || keyIdx===6){
                        tdValue=$('p:first-child', $(childElem).html()).text()
                    }

                    if(tdValue){
                        coinObj[keys[keyIdx]]=tdValue
                        keyIdx++
                    }
            })
            coinArr.push(coinObj)
        }
    })
            
    return(coinArr) 
    } catch (err){
        console.error(err)
    }
}



const app=express()

app.get('/api/price-feed', async(req, res)=>{
    try{
        const priceFeed=await getPriceFeed()
        return res.status(200).json({
            result:priceFeed,
        })
    }
    catch (err){
        return res.status(500).json({
            err:err.toString(),
        })
    }
})

app.listen(5500, ()=>{
    console.log('Running at port 5500')
})
