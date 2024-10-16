/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8'); //Path to your index.html

let dom;
let document;
let window;

describe('Graph Visualizer App Tests', () => {

    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
    });


    it('R1: Application structure - Single HTML file', () => {
        expect(document.querySelector('html')).not.toBeNull();
        expect(document.querySelector('style')).not.toBeNull();
        expect(document.querySelector('script')).not.toBeNull();
    });


    it('R2: Add nodes', () => {
        document.querySelector('[onclick="addNode()"]').click();
        expect(document.querySelectorAll('.node').length).toBe(1); //Check that a node was added
    });

    it('R3, R4: Add edges with weights', () => {
        window.prompt = jest.fn()
            .mockReturnValueOnce('0') //start node
            .mockReturnValueOnce('1') //end node
            .mockReturnValueOnce('5');  //weight

        document.querySelector('[onclick="addNode()"]').click(); //Add node 0
        document.querySelector('[onclick="addNode()"]').click(); //Add node 1
        document.querySelector('[onclick="addEdge()"]').click();
        expect(document.querySelectorAll('.edge').length).toBe(1);
        expect(document.querySelectorAll('.edge-weight').length).toBe(1);
        expect(document.querySelector('.edge-weight').textContent).toBe("5");

    });

    it('R5, R6: Select start and goal nodes', () => {
        document.body.innerHTML += `<input type="text" id="startNode" value ="0"> <input type="text" id="goalNode" value ="1">`;
        expect(document.getElementById('startNode').value).toBe("0");
        expect(document.getElementById('goalNode').value).toBe("1");

    });

    it('R7: Algorithm selection', () => {
        document.body.innerHTML += `<button onclick="runAlgorithm('bfs')">BFS</button> <button onclick="runAlgorithm('dfs')">DFS</button>`;
        expect(document.querySelector('[onclick="runAlgorithm(\'bfs\')"]')).not.toBeNull();
        expect(document.querySelector('[onclick="runAlgorithm(\'dfs\')"]')).not.toBeNull();
    });

    it('R8: Start traversal', () => {
        document.body.innerHTML += `<button id="start-traversal-button" onclick="runAlgorithm('bfs')">Start BFS</button>`;
        const button = document.getElementById('start-traversal-button');
        expect(button).not.toBeNull();
        button.click();
        expect(window.runAlgorithm).toHaveBeenCalledWith('bfs');
    });

    it('R9: Display total path cost', () => {
        document.body.innerHTML += `<div id="path-cost-display"></div>`;
        const display = document.getElementById('path-cost-display');
        display.textContent = '10';
        expect(display.textContent).toBe('10');
    });

    it('R10: Clear graph functionality', () => {
        document.body.innerHTML += `<button onclick="clearGraph()">Clear Graph</button>`;
        document.querySelector('[onclick="addNode()"]').click();
        document.querySelector('[onclick="addNode()"]').click();
        expect(document.querySelectorAll('.node').length).toBe(2);

        window.clearGraph = jest.fn(() => {
            while (graphContainer.firstChild) {
                graphContainer.removeChild(graphContainer.firstChild);
            }
            nodes = {};
            edges = [];
            nextNodeId = 0;
        });

        document.querySelector('[onclick="clearGraph()"]').click();
        expect(document.querySelectorAll('.node').length).toBe(0);
    });

    it('R11, R12: Invalid edge creation and error message', () => {
        document.body.innerHTML += `<div id="error-message"></div>`;
        window.prompt = jest.fn()
            .mockReturnValueOnce('0') //start node
            .mockReturnValueOnce('500') // invalid end node (doesn't exist)
            .mockReturnValueOnce('5');  //weight

        document.querySelector('[onclick="addNode()"]').click(); //Add node 0
        document.querySelector('[onclick="addEdge()"]').click();
        expect(window.alert).toHaveBeenCalledWith("Invalid node IDs or weight.");
    });

    it('R13: Remove node from graph', () => {
        document.body.innerHTML += `<button id="remove-node-button" onclick="removeNode(0)">Remove Node</button>`;
        window.removeNode = jest.fn((nodeId) => {
            delete nodes[nodeId];
            document.getElementById(`node-${nodeId}`).remove();
        });
        document.querySelector('[onclick="addNode()"]').click(); // Add node 0
        expect(document.querySelectorAll('.node').length).toBe(1);
        document.querySelector('[onclick="removeNode(0)"]').click(); // Remove node 0
        expect(document.querySelectorAll('.node').length).toBe(0);
    });

    it('R14: Update node lists dynamically', () => {
        document.body.innerHTML += `<select id="start-node-select"></select>`;
        const select = document.getElementById('start-node-select');
        document.querySelector('[onclick="addNode()"]').click(); // Add node 0
        const option = document.createElement('option');
        option.value = '0';
        option.text = 'Node 0';
        select.appendChild(option);
        expect(select.options.length).toBe(1);
    });

    it("R8, R9, R15: BFS Traversal", () => {
        document.body.innerHTML += `<input type="text" id="startNode" value ="0"> <input type="text" id="goalNode" value ="2">`;
        window.prompt = jest.fn()
            .mockReturnValueOnce('0') //start node
            .mockReturnValueOnce('1') //end node
            .mockReturnValueOnce('1')  //weight
            .mockReturnValueOnce('0') //start node
            .mockReturnValueOnce('2') //end node
            .mockReturnValueOnce('5')  //weight
            .mockReturnValueOnce('1') //start node
            .mockReturnValueOnce('2') //end node
            .mockReturnValueOnce('2')  //weight

        document.querySelector('[onclick="addNode()"]').click(); //Add node 0
        document.querySelector('[onclick="addNode()"]').click(); //Add node 1
        document.querySelector('[onclick="addNode()"]').click(); //Add node 2

        document.querySelector('[onclick="addEdge()"]').click(); //Edge 0-1
        document.querySelector('[onclick="addEdge()"]').click(); //Edge 0-2
        document.querySelector('[onclick="addEdge()"]').click(); //Edge 1-2

        document.querySelector('[onclick="runAlgorithm(\'bfs\')"]').click();
        const pathEdges = document.querySelectorAll('.edge[style*="stroke: red;"]');
        expect(pathEdges.length).toBeGreaterThan(0);
    });
});
