# Semester Project Proposal

My project will help people who struggle with journaling. I will build a website that prompts users each day to respond to a journal entry topic. Users can schedule when their prompts come, and they can view their responses in different formats. For example, they can sort by topic, by week/month/year, etc. They can also connect with other users and send each other prompts or share responses with each other. This will help people who don't know what to write about or who forget to write in a journal because it's tucked away and forgotten on a bookshelf.


# Domain Driven Design

## *Events*

* Account created
* Account deleted
* Account logged in
* Account logged out
* Password updated
* Prompt entry submitted
* Prompt entry deleted
* Prompt entry updated
* Entries viewed by topic
* Entries viewed by week
* Entries viewed by month
* Entries viewed by year
* Entry shared with friends
* Prompt shared with friends
* Prompt settings updated

## *Commands*

* createUser
* deleteUser
* userLogIn
* userLogOut
* updatePassword
* submitEntry
* deleteEntry
* updateEntry
* sortByTopic
* sortByWeek
* sortByMonth
* sortByYear
* shareEntry
* sharePrompt
* updatePromptSettings

## *Entities*

### Account

* User id (username/username)
* Name (chosen by user)
* Password (chosen by user)
* Session (Logged in or out)

### Entry

* Prompt
* promptid
* Topic
* Id (auto generated)
* Text
* Date

## *Value Objects*
None


# REST API Design

## *Endpoints*

| Description | URL Fragment | HTTP Method | Parameters | Representations |
| ----------- | ------------ | ----------- | ---------- | --------------- |
| create account | /accounts | POST |                   | Create Account  |
| delete account | /accounts/{userid} | DELETE | userid |                 |
| log in | /accounts/{userid}/login | PUT | userid      | Login           |
| log out | /accounts/{userid}/logout | PUT | userid    |                 |
| update password | /accounts/{userid}/settings | PUT | | Update Password |
| submit entry | /entries    | POST |                   | Submit Entry    |
| delete entry | /entries/{entryid} | DELETE | entryid  |                 |
| update entry | /entries/{entryid} | PUT | entryid     | Update Entry    |
| get tasks by topic | /entries/?topic= | GET | topic   | Sort by Topic   |
| get tasks by week | /entries/?week= | GET | date7days |                 |
| get tasks by month | /entries/?month= | GET | month    |                 |
| get tasks by year | /entries/?year= | GET | year      |                 |


## *Representations*

### Create Account
```json
{
    "firstname": "Andrew",
    "lastname": "Thibaudeau",
    "username": "example@username.com",
    "password": "fake-password"
}
```

### Login
```json
{
    "password": "fake-password"
}
```

### Update Password
```json
{
    "password": "new-password"
}
```

### Submit Entry
```json
{
    "promptid": "ae5df8n432",
    "entryid": "001",
    "text": "Become advanced in web development",
    "date": "01/11/2022"
}
```

### Update Entry
```json
{
    "text": "Have developed 3 personal project websites so that I can show employers my work."
}
```

### Sort By Topic
```json
[
    {
        "prompt": "What is one thing you hope to accomplish within the next year and why?",
        "promptid": "ae5df8n432",
        "topic": "future goals",
        "entryid": "001",
        "text": "Have developed 3 personal project websites so that I can show employers my work.",
        "date": "01/11/2022",
    },
    {
        "prompt": "What values do you hope your future family will have?",
        "promptid": "dk8ei3a239",
        "topic": "future goals",
        "entryid": "002",
        "text": "I want my family to regard other people with respect and be kind. I want my kids to instinctively stand up for their friends and serve others whenever someone needs help.",
        "date": "01/12/2022",
    }
]
```
