let rawData = [];
let processedData = [];
let selectedType = '';
let standard = 0;
let selectedPoint = null;


let layout = {
    xaxis: {
        title: {
            text: 'Time/s',
            font: { 
                size: 25,
                weight: 'bold'  
            }
        },
        showgrid: true,
        gridwidth: 1,
        gridcolor: '#E1E1E1',
        gridstyle: 'dash',
        dtick: 5,  
        zeroline: false,  
        showline: true,
        linewidth: 2,
        linecolor: 'black',
        mirror: false,  
        ticks: 'outside',
        tickfont: { 
            size: 12,
            weight: 'bold' 
        },
        side: 'bottom' 
    },
    yaxis: {
        title: {
            text: 'Potential/V',
            font: { 
                size: 25,
                weight: 'bold' 
            }
        },
        showgrid: true,
        gridwidth: 1,
        gridcolor: '#E1E1E1',
        gridstyle: 'dash',
        dtick: 0.2,  
        zeroline: false,  
        showline: true,
        linewidth: 2,
        linecolor: 'black',
        mirror: false,  
        ticks: 'outside',
        tickfont: { 
            size: 12,
            weight: 'bold'  
        },
        side: 'left'  
    },
    hovermode: 'closest',
    showlegend: false,
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: {  
        l: 80,
        r: 20,
        t: 20,
        b: 80
    }
};

// Input按钮处理
document.getElementById('inputBtn').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const type = await showSemiconductorTypeDialog();
                if (type) {
                    selectedType = type;
                    const text = await file.text();
                    processDataFile(text);
                }
            } catch (error) {
                console.error('Error processing file:', error);
                alert('Error processing file');
            }
        }
    });
    
    fileInput.click();
});


function showSemiconductorTypeDialog() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.background = 'white';
        dialog.style.padding = '20px';
        dialog.style.border = '1px solid black';
        dialog.style.zIndex = '1000';
        
        dialog.innerHTML = `
            <h3>Semiconductor type</h3>
            <button id="nBtn">n</button>
            <button id="pBtn">p</button>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelector('#nBtn').onclick = () => {
            dialog.remove();
            resolve('n');
        };
        
        dialog.querySelector('#pBtn').onclick = () => {
            dialog.remove();
            resolve('p');
        };
    });
}


function processDataFile(text) {
    try {
        
        const lines = text.split('\n')
            .filter(line => line.trim()) 
            .map(line => line.trim());

        
        let startIndex = 0;
        while (startIndex < lines.length) {
            const values = lines[startIndex].split(/[,\s]+/).map(Number);
            if (!isNaN(values[0]) && !isNaN(values[1])) {
                break;
            }
            startIndex++;
        }

        
        rawData = lines.slice(startIndex)
            .map(line => {
                const values = line.split(/[,\s]+/).map(Number);
                return {
                    x: values[0],
                    y: values[1]
                };
            })
            .filter(point => !isNaN(point.x) && !isNaN(point.y));

        if (rawData.length === 0) {
            throw new Error('No valid data found in file');
        }

        calculateStandard();
        processData();
        createPlot();
    } catch (error) {
        console.error('Error processing data:', error);
        alert('Error processing data file');
    }
}


function calculateStandard() {
    const first100 = rawData.slice(0, 100);
    let maxDiff = 0;
    
    for (let i = 1; i < first100.length; i++) {
        const diff = Math.abs(first100[i].y - first100[i-1].y);
        maxDiff = Math.max(maxDiff, diff);
    }
    
    standard = maxDiff;
}


function processData() {
    processedData = [];
    
    for (let i = 1; i < rawData.length - 1; i++) {
        const diff = rawData[i+1].y - rawData[i].y;
        const prevDiff = rawData[i].y - rawData[i-1].y;
        
        if (selectedType === 'n') {
            if (diff > standard * 10 && prevDiff <= standard * 10) {
                processedData.push(rawData[i]);
            }
        } else { 
            if (diff < -standard * 10 && prevDiff >= -standard * 10) {
                processedData.push(rawData[i]);
            }
        }
    }
}


document.getElementById('npBtn').addEventListener('click', async () => {
    try {
        const type = await showSemiconductorTypeDialog();
        if (type) {
            selectedType = type;
            processData();
            createPlot();
        }
    } catch (error) {
        console.error('Error changing type:', error);
    }
});


document.getElementById('addBtn').addEventListener('click', async () => {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid black;
        z-index: 1000;
    `;
    
    dialog.innerHTML = `
        <h3>Please enter the added data time value</h3>
        <input type="number" step="0.001" id="timeInput">
        <button id="confirmAdd">Confirm</button>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('confirmAdd').onclick = () => {
        const value = parseFloat(document.getElementById('timeInput').value);
        if (!isNaN(value)) {
           
            let closest = rawData[0];
            let minDiff = Math.abs(value - closest.x);
            
            for (const point of rawData) {
                const diff = Math.abs(value - point.x);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = point;
                }
            }
            
            processedData.push(closest);
            createPlot();
        }
        dialog.remove();
    };
});


document.getElementById('outputBtn').addEventListener('click', async () => {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid black;
        z-index: 1000;
    `;
    
    dialog.innerHTML = `
        <h3>Light excitation time (s)</h3>
        <input type="number" step="0.001" id="excitationInput">
        <button id="confirmOutput">Confirm</button>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('confirmOutput').onclick = () => {
        const value = parseFloat(document.getElementById('excitationInput').value);
        if (!isNaN(value) && value >= 0 && value <= 2) {
            generateCSV(value);
            dialog.remove();
            alert('Output successful');
        } else {
            alert('Incorrect input');
            dialog.remove();
        }
    };
});


function generateCSV(excitationTime) {
    
    let csvContent = 'Dark field time,Dark potential,Excitation time,Photopotential,Light-dark potential difference\n';
    
    processedData.forEach(point => {
        const excitationTimePoint = point.x + excitationTime;
        
        let closestPhotoPoint = rawData[0];
        let minTimeDiff = Math.abs(excitationTimePoint - rawData[0].x);
        
        for (const p of rawData) {
            const timeDiff = Math.abs(p.x - excitationTimePoint);
            if (timeDiff < minTimeDiff) {
                minTimeDiff = timeDiff;
                closestPhotoPoint = p;
            }
        }

        const potentialDiff = closestPhotoPoint.y - point.y;
        const row = [
            point.x.toFixed(6),                    
            point.y.toFixed(6),                    
            excitationTimePoint.toFixed(6),        
            closestPhotoPoint.y.toFixed(6),        
            potentialDiff.toFixed(6)               
        ].join(',');
        csvContent += row + '\n';
    });

    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'final.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function createPlot() {
    const traces = [
        {
            x: rawData.map(point => point.x),
            y: rawData.map(point => point.y),
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'darkblue',
                size: 2
            },
            name: 'Raw Data',
            hoverinfo: 'x+y'
        }
    ];

    
    if (!selectedPoint) {
        traces.push({
            x: processedData.map(point => point.x),
            y: processedData.map(point => point.y),
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'red',
                size: 4
            },
            name: 'Processed Data',
            hoverinfo: 'x+y'
        });
    } else {
        
        traces.push({
            x: [selectedPoint.x],
            y: [selectedPoint.y],
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'purple',
                size: 4
            },
            name: 'Selected Point',
            hoverinfo: 'x+y'
        });
    }

    Plotly.newPlot('plotArea', traces, layout)
        .then(() => {
            const plotArea = document.getElementById('plotArea');
            
           
            if (plotArea.removeAllListeners) {
                plotArea.removeAllListeners('plotly_click');
            }
            
            
            plotArea.on('plotly_click', (data) => {
                if (!data.points || data.points.length === 0) return;
                
                const point = data.points[0];
                const clickedX = point.x;
                const clickedY = point.y;

                
                if (!selectedPoint) {
                   
                    const isProcessedPoint = processedData.some(p => 
                        Math.abs(p.x - clickedX) < 0.0001 && 
                        Math.abs(p.y - clickedY) < 0.0001
                    );

                    if (isProcessedPoint) {
                        
                        selectedPoint = { 
                            x: clickedX, 
                            y: clickedY,
                            originalIndex: processedData.findIndex(p => 
                                Math.abs(p.x - clickedX) < 0.0001 && 
                                Math.abs(p.y - clickedY) < 0.0001
                            )
                        };
                        createPlot();
                    }
                }
            });
        });
}


document.addEventListener('keydown', function(event) {
    if (!selectedPoint) return;

    const currentIndex = rawData.findIndex(p => 
        Math.abs(p.x - selectedPoint.x) < 0.0001 && 
        Math.abs(p.y - selectedPoint.y) < 0.0001
    );
    
    if (currentIndex === -1) return;

    switch(event.key) {
        case 'ArrowLeft':
            if (currentIndex > 0) {
                selectedPoint = {
                    x: rawData[currentIndex - 1].x,
                    y: rawData[currentIndex - 1].y,
                    originalIndex: selectedPoint.originalIndex
                };
                createPlot();
            }
            break;
        case 'ArrowRight':
            if (currentIndex < rawData.length - 1) {
                selectedPoint = {
                    x: rawData[currentIndex + 1].x,
                    y: rawData[currentIndex + 1].y,
                    originalIndex: selectedPoint.originalIndex
                };
                createPlot();
            }
            break;
        case 'Enter':
            // 更新processedData中对应的点
            if (selectedPoint.originalIndex !== -1) {
                processedData[selectedPoint.originalIndex] = {
                    x: selectedPoint.x,
                    y: selectedPoint.y
                };
            }
            selectedPoint = null;
            createPlot();
            break;
        case 'Delete':
            
            if (selectedPoint.originalIndex !== -1) {
                processedData.splice(selectedPoint.originalIndex, 1);
            }
            selectedPoint = null;
            createPlot();
            break;
    }
});


document.getElementById('leftBtn').addEventListener('click', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(event);
});

document.getElementById('rightBtn').addEventListener('click', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(event);
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    document.dispatchEvent(event);
});

document.getElementById('confirmBtn').addEventListener('click', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(event);
});
