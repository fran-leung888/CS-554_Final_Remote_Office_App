# Introduction
Because being in the era of the epidemic has made people's work patterns all change. Many people have started to work from home, and to ensure efficiency and protect the security of company documents, we wanted to develop a chat app for internal use by employees. 
Main features: 
1. To ensure security, only employees of the same company (login verification) have access to this APP. 
2. It allows employees of different groups to communicate without barriers and enables members of different groups to chat separately. 
3. Can send files and pictures 
4. "Burn after reading" function. The person who sends the file can have the permission to choose the validity of the file (for example: expire within ten minutes, or when the other party has read it, the file expires immediately)

# Build Application

## Step 1: Configure Environment Setting
Copy the .env.local file included in the submission zip file into the web directory.

## Step 2: Build Docker Image
Run the command below
```
docker build -t final:v2 .
```
This operation may take a while. It is installing the module dependencies.

## Step 3: Start Service
Now we have our web service image, let's run it.
Run the command below
```
docker-compose up
```

## Final Step: Start Chatting
Visit http://localhost:3000 to start chatting with your colleague.