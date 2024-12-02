Data Processing and Visualization Tool
Overview
This tool is designed for processing and analyzing time-series potential data, specifically for semiconductor photoelectric response analysis. It provides an interactive interface for data visualization, point selection, and data export.
Key Features
Data Import
Accepts .txt files containing time-series data
Supports both n-type and p-type semiconductor data
Automatically processes and displays data points
Interactive Visualization
Displays raw data as blue points
Shows processed data as red points
Selected points highlighted in purple
Customizable grid and axis settings
Data Point Manipulation
Interactive point selection
Point movement using arrow keys or buttons
Point deletion capability
Point position confirmation
Data Export
CSV file generation
Includes calculated parameters
Customizable light excitation time
User Guide
1. Data Import
Click the "Input" button
Select your .txt data file
Choose semiconductor type (n/p)
Data will be automatically processed and displayed
2. Point Selection and Editing
Select Points: Click on any red point to select it (turns purple)
Move Points:
Use left/right arrow keys
Or use the "←" and "→" buttons
Confirm Changes:
Press Enter key
Or click the "Confirm" button
Delete Points:
Press Delete key
Or click the "Delete" button
3. Additional Controls
Add Points:
1. Click "Add" button
Enter time value
Confirm to add point
Change Type:
1. Click "n/p" button
Select new semiconductor type
Data will be reprocessed
4. Data Export
Click "Output" button
Enter light excitation time (0-2 seconds)
CSV file will be generated with:
Dark field time
Dark potential
Excitation time
Photopotential
Light-dark potential difference
Technical Specifications
Input Format: Text file with time and potential values
Data Processing: Automatic peak detection based on type
Visualization: Plotly.js-based interactive plotting
Export Format: CSV file with calculated parameters
Best Practices
Ensure input data is properly formatted
Verify semiconductor type selection
Review processed points before export
Check exported data for accuracy
Error Handling
Invalid file format: Error message displayed
Incorrect input values: User notification
Data processing errors: Error alerts
Invalid point selection: Operation ignored
System Requirements
Modern web browser
JavaScript enabled
Sufficient memory for data processing
File system access for import/export
Limitations
Maximum file size depends on browser memory
Processing time varies with data size
Export limited to CSV format
Light excitation time range: 0-2 seconds
Support and Maintenance
Regular updates for bug fixes
Performance optimizations
Feature enhancements based on user feedback
Technical support available
