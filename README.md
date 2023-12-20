[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Finfrastructure?branchName=main&label=infrastructure)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=58&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fnotification-service?branchName=main&label=notification-service)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=59&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fprogressive-web-app?branchName=main&label=progressive-web-app)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=60&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fpuppeteer?branchName=main&label=puppeteer)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=61&branchName=main)
[![CodeQL](https://github.com/talha0113/microsoft-account-profile-information/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/talha0113/microsoft-account-profile-information/actions/workflows/github-code-scanning/codeql)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Microsoft Account Information Application
- A basic progressive web application with front-end and back-end to utilize major concepts of **Angular**, **Serverless** and **Monitoring**
Application display user profile like image, email and name of logged in user defined in `Microsoft Entra ID`
- [Demo](https://fde-msaccprofinfo-dev-001-daa3b0a8bxbdgfc8.z01.azurefd.net)

### Frontend
Built with **Angular** and hosted in `Azure Static Web App` utilize following frameworks and libraries
  - **Angular**
  - **Microsoft Authentication Library** for OAuth
  - **@ngneat/elf** Client Side State Management
  - **Jasmine & Karma** for Unit Testing
  - **TypeScript**
  - **Puppeteer** and **Jest** for Automated UI Test
  - **Playwright** for targetting all the browserrs and using C#. (Comming soon)

``` mermaid
sequenceDiagram
    autonumber

    actor u as User

    participant l as Login
    participant a as Auhenticate
    participant s as Status
    participant p as Profile
    participant o as Logout
    participant b as Back-End
    
    u->>+l: Browse
    alt is authenticated?
        u->>+s: Logged In
    else is not authenticated
        u->>+a: Authenticate User
        a-->>-l: Authenticated
        l->>+s: Logged In
    end
    
    s->>+b: Fetch Live Subscriptions
    b-->>-s: Display Subscriptions
    s->>+b: Subscribe for push notifications
    b-->>-s: Push notifications subscribed
    u->>+p: View Profile Information
    u->>+o: LogOut Option
    o-->>-u: LoggedOut 
```    

### Backend
In order to save browser subscription and send push notification following implementation has been used
  - **Azure Functions** to receieve subscriptions from client and also perform unsubscribe
  - **Azure Cosmos DB** to store subscriptions from PWA
  - **Storage Queue** to add notifications in the queue and Azure Function Trigger to send notification
  - **Azure Monitor** to store all the logs and expception from applications and monitor the applications

![Architecture Diagram](./diagrams/Stack.png)

### Development Lifecycle
  - **Github Project and Issues** to Store all the tasks and issues
  - **Azure DevOps** for Continuous Integration and Delivery. Only main branch is deployed
  - **Release Annotations** to mark release in Application Insights

![Development LifeCycle Diagram](./diagrams/DevelopmentLifeCycle.png)
