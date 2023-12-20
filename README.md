[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Finfrastructure?branchName=main&label=infrastructure)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=58&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fnotification-service?branchName=main&label=notification-service)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=59&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fprogressive-web-app?branchName=main&label=progressive-web-app)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=60&branchName=main)
[![Build Status](https://dev.azure.com/talha0113/Open%20Source/_apis/build/status%2Fmicrosoft-account-profile-information%2Fpuppeteer?branchName=main&label=puppeteer)](https://dev.azure.com/talha0113/Open%20Source/_build/latest?definitionId=61&branchName=main)
[![CodeQL](https://github.com/talha0113/microsoft-account-profile-information/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/talha0113/microsoft-account-profile-information/actions/workflows/github-code-scanning/codeql)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Table of Contents
- [Microsoft Account Information Application](#microsoft-account-information-application)
- [Application Flow](#application-flow)
    - [Front-End](#front-end)
    - [Back-End](#back-end)
- [Architecture](#architecture)
- [DevOps](#devops)
    - [Branching](#branching)

## Microsoft Account Information Application
- A basic progressive web application with front-end and back-end to utilize major concepts of **Angular**, **Serverless** and **Monitoring**
Application display user profile like image, email and name of logged in user defined in `Microsoft Entra ID`
- [Demo](https://fde-msaccprofinfo-dev-001-daa3b0a8bxbdgfc8.z01.azurefd.net)

## Application Flow
### Front-End
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

### Back-End
In order to save browser subscription and send push notification following implementation has been used
  - **Azure Functions** to receieve subscriptions from client and also perform unsubscribe
  - **Azure Cosmos DB** to store subscriptions from PWA
  - **Storage Queue** to add notifications in the queue and Azure Function Trigger to send notification
  - **SignalR** to provide live notifications to PWA
  - **Azure Monitor** to store all the logs and expception from applications and monitor the applications

``` mermaid

sequenceDiagram
    autonumber

    participant p as Angular (PWA)
    participant g as Microsoft Graph
    participant f as Azure Functions
    participant c as Azure Cosmos DB
    participant q as Azure Queue Storage
    participant s as Azure SignalR
    participant m as Azure Monitor
    
    p->>+g: Fetch user information
    g-->>-p: Return information
    p->>+f: Subscribe push notification
    f->>+q: add subscription to queue
    q->>+c: subscription added to database
    c->>+f: notify for new subscription
    alt success?
        f->>+p: Push notification
    else error
        f->>+q: error notification 
        q->>+m: Log error
    end
    s->>+p: live notifications
```

## Architecture
![Architecture Diagram](./diagrams/Stack.png)

## DevOps
  - **Github Project and Issues** to Store all the tasks and issues
  - **Azure DevOps** for Continuous Integration and Delivery. Only main branch is deployed
  - **Release Annotations** to mark release in Application Insights
### Branching
Trunk based development has been opted to protect the main branch and short lived branches for new features and bugs
``` mermaid
    %%{init: { 'gitGraph': {'mainBranchName': 'main'}} }%%
    gitGraph
       commit
       commit
       branch feature/1
       checkout feature/1
       commit
       commit
       checkout main
       commit
       commit
       branch feature/2
       commit
       checkout main
       merge feature/1
       commit
       merge feature/2
       checkout main
       commit
       commit
       branch bug/3
       checkout bug/3
       commit
       checkout main
       merge bug/3
       commit
```
![Development LifeCycle Diagram](./diagrams/DevelopmentLifeCycle.png)
