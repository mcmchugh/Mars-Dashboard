//create Rover object that will store Rover Info
//convert object to immutable map
let roverInfo = Immutable.Map({
    currentRover: 'Curiosity',
    rovers: ['Spirit','Opportunity','Curiosity'],
    latestPhotos: ''
});

//use getData to grab data and grab array of photos
//returns the getRandomNumber function which is passed an array of photo data
const getData = (roverObject) => {
    if(typeof roverObject !== 'undefined') {
        const getRoverImg = roverObject.get('latestImg');

        if(typeof getRoverImg !== 'undefined') {
            const getImage = getRoverImg.latestImages.latest_photos;
            return getRandomNumber(getImage);
        }
    }
};

//Example of high order function
//generate random number and use the newly generated number to access one entry in the returned data
const getRandomNumber = (getImage) => {
    //generate random number and use the newly generated number to access one entry in the returned data
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    //Doc last updated Jan 9, 2021, by MDN contributors - referenced on Jan 25,2021 by MM
    const getLatestId = getImage.map(a => a.id);
    const getRandomNumber = getLatestId.length;
    const newNum = Math.floor(Math.random() * (getRandomNumber - 0) + 0);
    const roverImgDataRow = getImage[newNum];
    return roverImgDataRow;
}
// add our markup to the page
const root = document.getElementById('root')

//grabs the newly fetched data from the api and updates the rover info object
//Also is passed the getRover variable, which contains the current rover name variable
const updateRoverObject = (newState, getRover) => {
    const newObj = Immutable.Map(newState);
    const rovObj = roverInfo.merge(newObj);
    render(root, rovObj, getRover);
};

//bind the computed output from the App function to the root innerHTML
const render = async (root, rovObj, getRover) => {
    root.innerHTML = App(rovObj, getRover);
}

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
//Doc last updated Dec 21, 2020, by MDN contributors - referenced on Jan 25, 2021 by MM
//https://medium.com/samsung-internet-dev/html-and-templates-javascript-template-literals-2d7494ea3e6
//Doc last updated Oct 5, 2020, by Ada Rose Cannon, Co-chair of the W3C Immersive Web Working Group, Developer Advocate for Samsung - referenced on Jan 25,2021 by MM
//App function builds the template that displays the loading screen if undefined
//calls the getData function to grab the correct image and data, stores it in the dataRoverData
//This is passed into the functions that build the mobile and desktop template
//It is also passed into the function that builds out the image html
//It determines if the mobile template or the desktop template is displayed based on window size
const App = (rovObj, getRover) => {
    if(typeof rovObj !== 'undefined') {
        const dataRoverData = getData(rovObj);
        //use immutable js get method to access latestImg property and
        //assign to a new variable
        const getRoverphoto = rovObj.get('latestImg');

        //call getRoverImage to get rover image markup and pass
        //the chosen image and markup to buildMobile and buildDesktop
        //Both of these functions build up the header of the mobile and desktop templates
        const currentImage = getRoverImage(getRoverphoto, rovObj);
        const mobileView = buildMobile(getRover, currentImage, dataRoverData);
        const desktopView = buildDesktop(getRover, currentImage, dataRoverData);

        //if dataRoverCheck is undefined
        //display loading screen
        if(typeof dataRoverData == 'undefined'){
            return `
                <div class="mars-scape">
                <h1>Loading!</h1>
                </div>
            `
        }
        if(typeof dataRoverData !== 'undefined'){
            //use window.matchMedia to determine if the desktop or mobile template will be rendered
            //use this method versus pure responsive design, in order not to populate hidden elements on the page,
            //to better optimize data being displayed on the page
            if(window.matchMedia("(min-width: 768px)").matches) {
                return `${desktopView} `;
            } else {
                return `${mobileView} `;
            }
        }
    }
};

//builds the template string for desktop
//calls formatData function that builds the rover facts
//stored in a separate function so that it can be reused
//https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first
//Doc last updated Dec 29, 2020, by MDN contributors - referenced on Jan 25,2021 by MM

const buildDesktop = (roverName, currentImage, dataRoverData) => {
    if(typeof roverName !== 'undefined') {
        const getCurrentData = formatData(currentImage, dataRoverData);
        const roverList = roverInfo.get('rovers');

        let buildDesktopString = `<div class="desktop"><div class="desktop-header">`

        roverList.forEach((a,index) => {
            if(a.toLowerCase() === roverName.toLowerCase()) {
                buildDesktopString += `<div class="${a}">`
                buildDesktopString += `<button onclick="changeRover(event)" class="current-rover rover${index}"><span>${a}</span></button>`
                buildDesktopString += `</div>`
            } else {
                buildDesktopString += `<div class="${a}">`
                buildDesktopString += `<button onclick="changeRover(event)" class="rover${index}"><span>${a}</span></button>`
                buildDesktopString += `</div>`
            }
        })
        buildDesktopString += `</div></div>`
        buildDesktopString += `<div class="desktop-content-border ${roverName}"></div>`
        buildDesktopString += `<div class="desktop-img"><div class="desktop-rover" onclick="scrollToElement()">${roverName}<div class="icon">&#8675;</div></div>${currentImage}</div>`
        buildDesktopString += `<div class="desktop-content">${getCurrentData}</div>`
        buildDesktopString += `</div>`
        return buildDesktopString;
    }
};


//builds template string literal for the movile view of the rover app
//builds string to format a mobile friendly accordion
//calls formatData to grab rover data
const buildMobile = (roverName, currentImage, dataRoverData) => {
    if (typeof dataRoverData !== 'undefined') {
        const getListOfRovers = roverInfo.get('rovers');
        const formatedData = formatData(currentImage, dataRoverData);
        let buildMobileString = `<div class="rover-accord mobile"><div>`;

        getListOfRovers.forEach((a,index) => {
            if (a.toLowerCase() === roverName.toLowerCase()) {
                buildMobileString += `<div class="${a}">`
                buildMobileString += `<div class="button-wrapper"><button onclick="changeRover(event)" class="current-rover rover${index}"><span>${a}</span></button><span class="icon">&minus;</span></div>`
                buildMobileString += `<div>${formatedData}</div></div>`

            } else {
                buildMobileString += `<div class="${a}">`
                buildMobileString += `<div class="button-wrapper"><button onclick="changeRover(event)" class="rover${index}"><span>${a}</span></button><span class="icon">&plus;</span></div>`
                buildMobileString += `</div>`
            }
        });
        buildMobileString += `</div></div>`;

        return buildMobileString;
    }
};

//uses the getData function to grab data and to format in to
//the rover facts string literal
const formatData = (currentImage, dataRoverData) => {
    if (typeof currentImage !== 'undefined') {
        const currentRover = dataRoverData;
        if(currentRover) {
            return `
                <main>
                    <div class="rover-info">
                        <section class="img-section">
                            <div>
                                ${currentImage}
                            </div>
                        </section>
                        <section class="info">
                            <h2>${currentRover.rover.name} Facts</h2>
                            <p><b>Name: </b>${currentRover.rover.name}</p>
                            <p><b>Id:</b> ${currentRover.rover.id}</p>
                            <p><b>Landing date:</b> ${currentRover.rover.landing_date}</p>
                            <p><b>Launch date: </b>${currentRover.rover.launch_date}</p>
                            <p><b>Earth date: </b>${currentRover.earth_date}</p>
                            <p><b>Status: </b>${currentRover.rover.status}</p>
                            <p><b>Camera name: </b>${currentRover.camera.full_name}</p>
                        </section>
                    </div>
                </main>`
        }
    }
};

//interactive element - gets height of the desktop-img element and uses that
//as the value to scroll to when the scrollToElement click handler is clicked
const scrollToElement = () => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
    //Doc last updated Jan 9, 2021, by MDN contributors - referenced on Jan 25,2021 by MM
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
    //Doc last updated Jan 9, 2021, by MDN contributors - referenced on Jan 25,2021 by MM
    const getImg = document.querySelector('.desktop-img').clientHeight;
    const scrollTo = {
        top: getImg,
        behavior: 'smooth'
      }
      window.scrollTo(scrollTo);
};

//used when the user interacts with the app
//called when the user clicks the rover button
//grabs the text from the element clicked and is passed to the updateRoverNameFunction
//example of a high order function
const changeRover =  (e) => {
    const getRoverName = e.target.textContent;
    getRoverName.toLowerCase();
    const updateRoverData = upDateRoverName(getRoverName, roverInfo);
    return updateRoverData();
};

//after click, update the rover object currentRover property and pass
//that object  directly to the getMarsRoverImages function, which initiates the API call
const upDateRoverName = (name,roverInfo) => {
    const roverUpdateCurrentRov = roverInfo.set('currentRover', name);
    return function () {
        getLatestImages(roverUpdateCurrentRov);
    }
};

//listening for load event because page should load before any JS is called
//on window load, call the render function to initiate the JS
window.addEventListener('load', () => {
    render(root, roverInfo);
})

// Example of a pure function that renders infomation requested from the backend
//function that returns the output of the image
const getRoverImage = ( getRoverImg, rovObj) => {
    const currentRoverData = getData(rovObj);
    if ( !getRoverImg) {
        getLatestImages(rovObj);
    }
    if(typeof currentRoverData !== 'undefined') {
        return `
        <img class="rover-image" src="${currentRoverData.img_src}"  alt="${currentRoverData.rover.name}-img"/>
        `
    }
};

//API call - passes current rover name as a query parameter
const getLatestImages = (rovObj) => {
    let latestImg;
    //use immutable js get method to access currentRover property from object
    const getRover = rovObj.get('currentRover').toLowerCase();
    fetch(`http://localhost:3000/mars-rovers-latest-img?rover=${getRover}`)
        .then(res => res.json())
        .then(latestImg => updateRoverObject( {latestImg}, getRover ))
    return latestImg;
};

