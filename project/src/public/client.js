//Create Rover object that will store Rover Info
//Convert object to immutable map
let roverInfo = Immutable.Map({
    currentRover: 'Curiosity',
    rovers: ['Spirit','Opportunity','Curiosity'],
    latestPhotos: '',
    loadImgSRC: ''
});

//Use getData to grab data and grab array of photos
//Returns the getRandomNumber function which is passed an array of photo data
const getData = (roverObject, id) => {
    if(typeof roverObject !== 'undefined') {
        const getRoverImg = roverObject.get('latestImg');
        if(typeof getRoverImg !== 'undefined') {
            const getImage = getRoverImg.latestImages.latest_photos;
            return getRandomNumber(getImage, id);
        }
    }
};

//Example of high order function
//If this is the first  call to the api or the rover is being changed
//Generate random number and use the newly generated number to access one entry in the returned data
//If id isn't undefined or empty, use the id to return a single entry
const getRandomNumber = (getImage, id) => {
    //Generate random number and use the newly generated number to access one entry in the returned data
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    //Doc last updated Jan 9, 2021, by MDN contributors - referenced on Jan 25,2021 by MM
    const getLatestId = getImage.map(a => a.id);
    if(typeof id === 'undefined' || id == '') {
        const getRandomNumber = getLatestId.length;
        const newNum = Math.floor(Math.random() * (getRandomNumber - 0) + 0);
        const getRandomWithId = getLatestId[newNum]
        const roverImgDataRow = getImage.filter(a => a.id == getRandomWithId);
        return roverImgDataRow[0];
    } else {
        const roverImgDataRow = getImage.filter(a => a.id == id);
        return roverImgDataRow[0];
    }
};

//Sort chronologically by photo ids
//Return newly sorted array
const getImageGrid = (getImage) => {
    const getNewOrdered = getImage.sort((a,b) => {
        return a.id - b.id
    })
    return getNewOrdered;
};

//Add our markup to the page
const root = document.getElementById('root');

//Grabs the newly fetched data from the api and updates the rover info object
//Passes the getRover variable, which contains the current rover name variable
//Passes an id used to access an entry of the photo array
//Passes a bool that determines if grid or informational view is showing
const updateRoverObject = (newState, getRover, id, bool) => {
    const newObj = Immutable.Map(newState);
    const rovObj = roverInfo.merge(newObj);
    render(root, rovObj, getRover, id, bool);
};

//Bind the computed output from the App function to the root innerHTML
const render = async (root, rovObj, getRover, id, bool) => {
    root.innerHTML = App(rovObj, getRover, id, bool);
};

//App function builds the template that displays the loading screen if undefined
//Calls the getData function to grab the correct image and data, stores it in the dataRoverData
//This is passed into the functions that build the mobile and desktop template
//It is also passed into the function that builds out the image html
//It determines if the mobile template or the desktop template is displayed based on window size
const App = (rovObj, getRover,  id, bool) => {
    if(typeof rovObj !== 'undefined') {
        const dataRoverData = getData(rovObj, id);
        if(typeof dataRoverData !== 'undefined') {
            const getId =  dataRoverData.id;
            const roverUpdateCurrentRov= roverInfo.set('currentRoverId', getId);
        }
        //BuildHTMLContent builds either the loading screen or builds the grid, which is visible on default
        const getContent = buildHTMLContent(getRover, dataRoverData, rovObj, bool, true);
        const loadingScreen = buildHTMLContent(getRover, dataRoverData, rovObj, bool, false);

        if(typeof dataRoverData == 'undefined'){
            return `${loadingScreen} `;
        }
        if(typeof dataRoverData !== 'undefined'){
            return `${getContent} `;
        }
    }
};

//Builds the template string
//Calls formatData function that builds the rover facts and the grid
//Calls buildHTMLHeader to build the navigation
//Toggles visibility of grid or informational section
//Everything that touches and interacts with the DOM lives in the buildHTMLContent function
//https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first
//Doc last updated Dec 29, 2020, by MDN contributors - referenced on Jan 25,2021 by MM
const buildHTMLContent = (roverName, dataRoverData, rovObj, bool, loading) => {
    if(loading === true) {
        const getRoverImage = ( getRoverImg, rovObj) => {
            let id;
            if (typeof getRoverImg == 'undefined') {
                getLatestImages(rovObj, id, false);
            }
            if (typeof getRoverImg !== 'undefined') {
                return `
                    <img class="rover-image" src="${getRoverImg.img_src}"  alt="${getRoverImg.rover.name}-img"/>`;
            }
        };

        const currentImg = getRoverImage(dataRoverData, rovObj);

        if(typeof roverName !== 'undefined') {
            //FormatData function builds the HTML that toggles the informational view and the grid view of the app
            //Returns the correct view - either the grid or the information section
            const formatData = (currentImage, dataRoverData, rovObj, bool) => {

                const currentRover = dataRoverData;

                //Use display and hide to toggle visibilty of the grid or the information section
                const display = bool == true ? 'show' : 'hide';
                const hide = bool == true ? 'hide' : 'show';
                if (typeof currentImage !== 'undefined') {
                    //Get the photo array from the obj
                    const getRoverImg1 = rovObj.get('latestImg');
                    const getImageArr = getRoverImg1.latestImages.latest_photos;
                    const roverImgArr = getImageGrid(getImageArr);

                    //Begin building string literal of grid
                    //Loop through the roverImgArr array to build the image grid
                    let buildGrid = `<div class="grid-wrapper ">`;
                    roverImgArr.forEach(a => {
                        buildGrid += `  <div class="img-grid-wrapper">
                                        <img class="img-${a.id}" onclick="getInfo(${a.id},'${a.rover.name}', true)" style="width:100%" src="${a.img_src}"/>
                                        </div>`;
                    });
                    buildGrid += `</div>`;

                    //Build html that houses informational section and grid
                    //Toggle visibility using the display varible
                    if(typeof currentRover !== 'undefined') {
                        let informationSection  = `<main>`;
                            if(display == 'show') {
                                informationSection += `<div class="rover-info ${display}">
                                                        <section class="img-section">
                                                        <button class="${display}" onclick="getInfo(${currentRover.rover.id}, '${currentRover.rover.name}', false)" data-target="${currentRover.id}">
                                                        &lt;Back to image gallery
                                                        </button>
                                                        <div>
                                                        <img class="img-wide" src="${currentRover.img_src}"/>
                                                        </div>
                                                        <div>
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
                                                        </div>`;
                            } else if (display == 'hide') {
                                informationSection +=` <div class="grid-view ${hide}">
                                                        ${buildGrid}
                                                        </div>`;
                            }
                            informationSection += `<main>`;
                            return informationSection;
                    }
                }
            };
            //Call formatData function and assign to the getCurrentData variable
            //Pass it into the buildHTMLHeader() function
            const getCurrentData = formatData(currentImg, dataRoverData, rovObj, bool);
            const roverList = roverInfo.get('rovers');
            //BuildHTMLHeader builds the top header portion of the html
            //Toggles current rover information and images
            //Loop through the list of rovers to build the navigation at the top of the page
            const buildHTMLHeader = (roverName,currentImage, getCurrentData) => {
                let buildHeaderString = `<div class="header-wrapper"><div class="header">`;
                roverList.forEach((a,index) => {
                    if(a.toLowerCase() === roverName.toLowerCase()) {
                        buildHeaderString += `<div class="${a}">`
                        buildHeaderString += `<button onclick="changeRover(event)" class="current-rover rover${index}">`
                        buildHeaderString += `<span>${a}</span>`
                        buildHeaderString += `</button>`
                        buildHeaderString += `</div>`
                    } else {
                        buildHeaderString += `<div class="${a}">`
                        buildHeaderString += `<button onclick="changeRover(event)" class="rover${index}">`
                        buildHeaderString += `<span>${a}</span></button>`
                        buildHeaderString += `</button>`
                        buildHeaderString += `</div>`
                    }
                })
                buildHeaderString += `</div></div>`
                buildHeaderString += `<div class="content-border ${roverName}"></div>`
                buildHeaderString += `<div class="img-wrapper"><div class="rover">${roverName}</div>${currentImage}</div>`
                buildHeaderString += `<div class="content">${getCurrentData}</div>`
                buildHeaderString += `</div>`
                return buildHeaderString;
            };
            const headerString = buildHTMLHeader(roverName, currentImg, getCurrentData);
            return headerString;
        }
    } else {
        //If content is still loading return the loading screen html
        return `
            <div class="mars-scape">
                <h1>Loading!</h1>
            </div>`
        }
};

//Set current rover id
//Set current rover name
//Pass into getLatestImages- bool argument determines if grid or info section view is visible
const getInfo = (e, roverName, bool) => {

    const roverUpdateCurrentRov = roverInfo.set('currentRoverId', e);
    const updateCurrentRovName = roverUpdateCurrentRov.set('currentRover', roverName);
    getLatestImages(updateCurrentRovName, e, bool);
};

//Called when the user clicks the rover button
//Grabs the text from the element clicked and is passed to the updateRoverNameFunction
//Example of a high order function
const changeRover =  (e) => {
    const getRoverName = e.target.textContent;
    getRoverName.toLowerCase();
    const updateRoverData = upDateRoverName(getRoverName, roverInfo);
    return updateRoverData();
};

//After click, update the rover object currentRover property and pass
//That object  directly to the getLatestImages function, which initiates the API call
//Use empty var id to pass to the getLatestImages function, because we are grabbing data for
//new rover and we don't have that data yet - this undefined variable is handled in the getRandomNumber function
const upDateRoverName = (name,roverInfo) => {
    const roverUpdateCurrentRov = roverInfo.set('currentRover', name);
    const id = '';
    return function () {
        getLatestImages(roverUpdateCurrentRov, id, false);
    }
};

//Listening for load event because page should load before any JS is called
//On window load, call the render function to initiate the JS
window.addEventListener('load', () => {
    render(root, roverInfo);
})

//API call - passes current rover name as a query parameter
//apply checks for exception handling
const getLatestImages = (rovObj, id, bool) => {
    let latestImg;
    //Use immutable js get method to access currentRover property from object
    const getRover = rovObj.get('currentRover').toLowerCase();
    fetch(`http://localhost:3000/mars-rovers-latest-img?rover=${getRover}`)
    .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Something went wrong');
    }
    })
    .then(latestImg => {
        updateRoverObject( {latestImg}, getRover, id, bool )})
    .catch((error) => {
    console.log(error)
    });
    return latestImg;
};
