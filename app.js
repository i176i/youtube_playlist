const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { resolve } = require('path');
const { rejects } = require('assert');
const { type } = require('os');
// const ejs = require('ejs');

const app = express();

app.get('/', (req,res)=>{
    const url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=AIzaSyCyC7fx4SWBmCUyU_NxJ4u9XQoTQ1d0f6Q&playlistId=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y";
   
    let chunks=[];
    var finmin = 0;
    var finsec = 0;
    var counter = 1;
    https.get(url, (response)=>{
        response.on('data', (data)=>{
             chunks.push(data);
        }).on('end',()=>{
            let data = Buffer.concat(chunks);
            let schema = JSON.parse(data);
            console.log(schema);
            schema.items.forEach(element => {
                // console.log(element.contentDetails);
                const url2='https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&id='+element.contentDetails.videoId+'&key=AIzaSyAZfHUGzuJvd6D_bXjzOoPu_7JXywx8JX4&fields=items/contentDetails/duration';
                let chunk2=[];
                let timeArray=[];
                https.get(url2,(response)=>{
                    response.on('data',(data)=>{
                        chunk2.push(data);
                    }).on('end',()=>{
                        let data2 = Buffer.concat(chunk2);
                        let schema2 = JSON.parse(data2);
                        let temp = schema2.items[0].contentDetails.duration;
                        var length = temp.length;
                        temp = temp.substring(2,length-1);
                        timeArray = temp.split('M');
                        if(timeArray[1]==undefined){
                            timeArray.push(0);
                        }
                        timeArray.push(element.contentDetails.videoId);
                         
                    }).on('end',()=>{
                        finmin = finmin +  parseInt(timeArray[0]) ;
                        finsec = finsec + parseInt(timeArray[1]);
                        console.log(timeArray[0]+" minutes and "+ timeArray[1]+" seconds and videoID : "+timeArray[2]);
                        console.log((finmin));
                        abc(finmin,finsec,counter++, schema.items.length);
                        
                    })
                })
            
            });
            
        })
    })
    
    res.send('<h1>heading</h1>');
})

function abc(finmin, finsec , counter, chunksSize){
    console.log(counter);
    // console.log(chunksSize);
    if(counter<chunksSize){
        return;
    }
        finmin = finmin + finsec/60;
            finsec = finsec%60;
            console.log("the final size is "+finmin + " minutes and "+ finsec+" seconds.");
            console.log(finmin);
}


app.listen(800,()=>{
    console.log('listening at port 800');
})