// http://youtube.com/watch?v=bLl_VRQ7pBs

const search = document.getElementById('search');
const downloadBtn = document.getElementById('downloadBtn');
const searchBtn = document.getElementById('searchBtn');
const videoDetails = document.getElementById('videoDetails');
const videoPlayer = document.getElementById('videoPlayer');
const title = document.getElementById('title');
videoDetails.style.display = "none";
async function getVideoFormats(id) {
    const resp = await fetch("http://localhost:3000/" + id.split("v=")[1].substring(0, 11))
    const data = await resp.json()
    return data;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

downloadBtn.addEventListener('click', () => {
    removeAllChildNodes(videoDetails)
    videoPreview.style.display = "none";
    getVideoFormats(search.value).then(formats => {
        videoDetails.style.display = "block";

        formats.formats.forEach(format => {
            const div = document.createElement('div')
            div.onclick = () => {
                videoPreview.style.display = "block";
                videoPlayer.src = format.url;
            }

            const mimeType = document.createElement('p')
            if (format.mimeType.includes("video")) {
                mimeType.innerHTML = "Video - " + format.qualityLabel;
            } else if (format.mimeType.includes("audio")) {
                mimeType.innerHTML = "Audio - " + format.bitrate;
            }
            mimeType.classList.add("videoMime")
            div.append(mimeType);

            videoDetails.style.height = '500px';
            videoDetails.style.overflow = 'scroll';
            videoDetails.append(div);
        })

        const videoInfo = formats.videoDetails;
        title.innerText = videoInfo.author.name + " - " + videoInfo.author.subscriber_count;
        title.innerText += "\n" + videoInfo.title;

    })
})


async function getYoutubeSearchResults(term) {
    const resp = await fetch("http://localhost:3000/search/" + term);
    const data = await resp.json()
    return data;
}

searchBtn.addEventListener('click', () => {
    removeAllChildNodes(videoDetails)
    const term = search.value;
    search.value = "";
    getYoutubeSearchResults(term).then(data => {
        console.log("Processing Search Term")
        let videos = data.items.filter(video => video.type === "video")
        console.log(videos)

        videos.forEach(video => {
            const div = document.createElement('div')
            const heading = document.createElement('h1')
            heading.innerText = video.title;
            const thumb = document.createElement('img')
            try {
                thumb.src = video.thumbnails[0]?.url;
                thumb.height = video.thumbnails[0]?.height;
                thumb.width = video.thumbnails[0]?.width;
            } catch (error) {
                console.log(error);
            }
            thumb.onclick = () => {
                search.value = video.url;
            }
            const views = document.createElement('p')
            views.innerText = `Views: ${video.views}  Dur: ${video.duration}`;

            div.append(heading, thumb, views)
            videoDetails.style.display = "block";
            videoDetails.append(div)
        })
    })
})

