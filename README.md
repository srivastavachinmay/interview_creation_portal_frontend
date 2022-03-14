# Interview Creation Portal

## Deployed here: https://scaler-frontend-assignment.herokuapp.com/

### Basic Requirements

 * An interview creation page where the admin can create an interview by selecting participants, start time and end time. Backend should throw error with proper error message if:
     * Any of the participants is not available during the scheduled time (i.e, has another interview scheduled)
     * No of participants is less than 2
 * An interviews list page where admin can see all the upcoming interviews.
 * Note: No need to add a page to create Users/Participants. Create them directly in the database

### How to build and run this project

 * Clone this repository.
 * Execute npm install
 * Make sure [backend](https://github.com/srivastavachinmay/scaler-backend-assignment) running.
 * Execute npm start.
 * App will start running at http://localhost:3000/
