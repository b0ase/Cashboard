# Workflow Export/Import System

This document describes the new workflow export/import functionality added to Cashboard, allowing users to save and restore complete workflow states with all node positions, connections, and settings.

## Features

### Export Functionality
- **Export Button**: Located in the workflow canvas controls panel (top-right)
- **Complete Workflow State**: Exports all nodes, edges, positions, and canvas settings
- **Metadata Preservation**: Includes workflow name, description, version, and export timestamp
- **Canvas Settings**: Preserves viewport position, zoom level, and connection styles
- **File Format**: JSON format with descriptive filename

### Import Functionality
- **Import Button**: Available in both the Workflow Dashboard and individual workflow canvases
- **Dashboard Import**: Adds imported workflows to the workflow library
- **Canvas Import**: Directly loads workflows into the current canvas
- **Format Support**: Handles both Cashboard exports and generic workflow formats
- **Smart Import**: Automatically detects export format and applies appropriate import logic

## Usage

### Exporting a Workflow

1. **Open a workflow canvas** in Cashboard
2. **Locate the export button** (📤 Export) in the top-right controls panel
3. **Click the export button** to download the workflow as a JSON file
4. **File naming**: Automatically generates descriptive filenames (e.g., `MyWorkflow_workflow_2024-01-20.json`)

### Importing a Workflow

#### Option 1: Import to Dashboard
1. **Navigate to the Workflow Dashboard**
2. **Click the Import button** (📥 Import) in the header section
3. **Select a JSON file** exported from Cashboard or compatible workflow tool
4. **Workflow is added** to your workflow library with full metadata

#### Option 2: Import to Canvas
1. **Open any workflow canvas**
2. **Click the Import button** (📥 Import) in the controls panel
3. **Select a JSON file** to import
4. **Workflow is loaded** directly into the current canvas with preserved positioning

## Export File Structure

The exported JSON file contains the following structure:

```json
{
  "metadata": {
    "name": "Workflow Name",
    "description": "Workflow description",
    "version": "1.0.0",
    "exportedAt": "2024-01-20T12:00:00.000Z",
    "author": "Cashboard User",
    "type": "workflow_export",
    "canvasInfo": {
      "totalNodes": 5,
      "totalEdges": 4,
      "canvasScale": 100,
      "isRunning": false,
      "autoMode": false
    }
  },
  "workflow": {
    "nodes": [
      {
        "id": "node1",
        "position": { "x": 100, "y": 100 },
        "data": { "label": "Node Label", "kind": "workflow" },
        "type": "colored"
      }
    ],
    "edges": [
      {
        "id": "edge1",
        "source": "node1",
        "target": "node2",
        "type": "default"
      }
    ],
    "viewport": {
      "x": 0,
      "y": 0,
      "zoom": 1
    },
    "settings": {
      "connectionStyle": "straight",
      "gridSnap": true,
      "showGrid": true
    }
  }
}
```

## Import Compatibility

### Cashboard Exports
- **Full compatibility** with all features preserved
- **Automatic detection** of export format
- **Complete restoration** of workflow state
- **Settings preservation** including viewport and connection styles

### Generic Workflow Formats
- **Basic compatibility** with standard workflow structures
- **Automatic ID generation** for imported elements
- **Position randomization** if coordinates are missing
- **Flexible edge mapping** (supports both `source/target` and `from/to`)

## Benefits

1. **Workflow Backup**: Save important workflows for safekeeping
2. **Collaboration**: Share workflows with team members
3. **Version Control**: Track workflow evolution over time
4. **Template Library**: Build a collection of reusable workflow patterns
5. **Disaster Recovery**: Restore workflows after system issues
6. **Cross-Platform**: Move workflows between different Cashboard instances

## Technical Details

### Export Process
- Captures current React Flow state
- Serializes all node and edge data
- Preserves canvas viewport and settings
- Generates timestamped metadata
- Creates downloadable JSON blob

### Import Process
- Validates JSON file structure
- Detects export format automatically
- Maps imported data to React Flow format
- Handles ID conflicts gracefully
- Restores canvas state completely

### Error Handling
- **File Format Validation**: Ensures JSON structure is correct
- **Data Integrity Checks**: Validates required fields are present
- **User Feedback**: Clear success/error messages with details
- **Graceful Degradation**: Handles missing or invalid data gracefully

## Example Use Cases

1. **Backup Current Work**: Export before making major changes
2. **Share with Team**: Export and send to colleagues
3. **Template Creation**: Export successful workflows as templates
4. **Archiving**: Save completed workflows for future reference
5. **Migration**: Move workflows between different environments
6. **Documentation**: Export workflows for documentation purposes

## Troubleshooting

### Common Issues

**Import Fails with "Invalid Format" Error**
- Ensure the file is a valid JSON file
- Check that the file was exported from Cashboard
- Verify the file structure matches the expected format

**Nodes Import but Connections Don't**
- Check that edge source/target IDs match node IDs
- Ensure the JSON file contains both nodes and edges arrays

**Canvas Viewport Not Restored**
- Verify the export file contains viewport data
- Check that the viewport object has x, y, and zoom properties

**Import Adds Duplicate Elements**
- Clear the canvas before importing if you want a clean import
- Use the import to add to existing workflows rather than replace

### Best Practices

1. **Regular Exports**: Export workflows periodically as backups
2. **Descriptive Names**: Use meaningful workflow names for easier identification
3. **Version Control**: Include version numbers in workflow names
4. **Testing Imports**: Test import functionality with sample workflows
5. **File Organization**: Organize exported files in a dedicated folder

## Future Enhancements

- **Batch Import/Export**: Handle multiple workflows at once
- **Cloud Storage**: Direct integration with cloud storage services
- **Version History**: Track changes between exports
- **Collaborative Editing**: Real-time workflow sharing
- **Format Conversion**: Support for additional workflow formats
- **Template Marketplace**: Share and discover workflow templates

## Support

For issues or questions about the workflow export/import system:
1. Check the browser console for detailed error messages
2. Verify the JSON file structure matches the expected format
3. Test with the provided sample workflow file
4. Report bugs with the exported JSON file attached
