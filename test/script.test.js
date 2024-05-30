const { JSDOM } = require("jsdom");
const fetchMock = require("jest-fetch-mock");

fetchMock.enableMocks();

describe("showMovies", () => {
    let window;
    let document;
    let rootElement;
    let showMovies;

    beforeEach((done) => {
        fetch.resetMocks();
        const dom = new JSDOM(`<!DOCTYPE html><div id="root"></div>`, { runScripts: "dangerously" });
        dom.window.onload = () => {
            window = dom.window;
            document = window.document;
            global.document = document;
            rootElement = document.getElementById("root");
            global.rootElement = rootElement;
            showMovies = require('../frontend/script.js').showMovies;
            done();
        };
    });


    test("should fetch and display movies", async () => {
        const mockMovieData = {
            results: [
                { id: 1, title: "Mock Movie 1", poster_path: "/mockpath1.jpg" },
                { id: 2, title: "Mock Movie 2", poster_path: "/mockpath2.jpg" }
            ]
        };
    
        fetch.mockResponseOnce(JSON.stringify(mockMovieData));
    
        const apiUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=e39de4c3c1c2758867914877e0dea313';
        await showMovies(apiUrl, rootElement);
    
        
        await new Promise(resolve => setTimeout(resolve, 0));
    
        
        expect(fetch).toHaveBeenCalledWith(apiUrl);
        expect(rootElement.innerHTML).toContain("Mock Movie 1");
        expect(rootElement.innerHTML).toContain("Mock Movie 2");
    });
    
});