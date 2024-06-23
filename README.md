
By following these steps, you should be able to set up, deploy, and validate your Azure Function that sends data to Splunk.


Step 1: Install Visual Studio Code
Download and Install VS Code:
Go to the Visual Studio Code website.
Download the installer for your operating system.
Follow the installation instructions.
Step 2: Install Node.js
Download and Install Node.js:

Go to the Node.js website.
Download the LTS version.
Follow the installation instructions.
Verify Installation: Open a terminal or command prompt and run:

node -v
npm -v
Step 3: Install Azure Functions Core Tools
Install Azure Functions Core Tools:

Open a terminal or command prompt.
Run the following command:
npm install -g azure-functions-core-tools@4 --unsafe-perm true
Verify Installation:

func --version
Step 4: Install Azure CLI
Download and Install Azure CLI:

Go to the Azure CLI website.
Follow the installation instructions for your operating system.
Verify Installation:

az --version
Step 5: Set Up VS Code for Azure Development
Install Azure Functions Extension:

Open VS Code.
Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
Search for "Azure Functions" and install the extension.
Install Azure Storage Extension:

Similarly, search for "Azure Storage" and install the extension.
Install Azure Account Extension:

Search for "Azure Account" and install the extension.
Step 6: Create a New Azure Function App
Sign in to Azure:

Open VS Code.
Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
Type Azure: Sign In and follow the prompts to sign in to your Azure account.
Create a New Project:

Open the Command Palette and type Azure Functions: Create New Project....
Select a folder for your project.
Select the language (JavaScript).
Select the template (Timer trigger).
Provide a function name (e.g., TimerTriggerFunction).
Set the schedule (e.g., 0 5 * * * * to run every hour at the 5th minute).
Choose the storage account connection setting.
Install Dependencies:

Navigate to the project folder in the terminal.
Install the Azure Storage Blob SDK:
npm install @azure/storage-blob axios

Configure Environment Variables:

Create a local.settings.json file in the project root with the following content:

{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "AZURE_STORAGE_ACCOUNT_NAME": "<your_storage_account_name>",
        "AZURE_STORAGE_ACCOUNT_KEY": "<your_storage_account_key>",
        "AZURE_STORAGE_CONTAINER_NAME": "<your_container_name>",
        "SPLUNK_HEC_URL": "<your_hec_url>",
        "SPLUNK_HEC_TOKEN": "<your_hec_token>"
    }
}
Step 7: Test Locally
Run the Function:

Open a terminal in the project folder.
Run the function locally:
func start
Check Logs:

Ensure the function runs without errors and logs successful or failed attempts to send data to Splunk.
Step 8: Deploy to Azure
Deploy the Function:
Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
Type Azure Functions: Deploy to Function App.
Select your subscription and existing Function App or create a new one.
Follow the prompts to complete the deployment.
Step 9: Validate in Splunk
Search for Incoming Data:

Open the Splunk Search & Reporting app.

Use the following search query to look for data:

index=<your_index> sourcetype=<your_sourcetype>
Check for Specific Events:

Refine your search to look for specific content you expect to see.
Additional Notes
Ensure your function app in Azure has the correct environment variables configured.
Monitor the Azure Function in the Azure portal to check for any runtime errors.
Check Splunk internal logs if data doesn't appear to troubleshoot any ingestion issues.
By following these steps, you should be able to set up, deploy, and validate your Azure Function that sends data to Splunk.
