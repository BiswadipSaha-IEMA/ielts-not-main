const useTemplate = (name) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificate Template</title>

            <style type='text/css'>
            body, html {
                margin: 0;
                padding: 0;
            }
            body {
                color: black;
                display: table;
                font-family: Georgia, serif;
                font-size: 34px;
                text-align: center;
                background-image: linear-gradient(to bottom, #ffffff, #ffffff);
                position: relative; /* Add position relative */
            }
            
            .logo {
                color: tan;
            }

            .marquee {
               color:#040338;
                font-size: 115px;
                font-family:cursive;
                font-style:italic;
                font-weight:bolder;
                margin-top:58px;
            }
            .assignment {
                margin-top: 28px;
                font-size:58px;
            }
            .person {
                font-weight:bold;
                font-size: 62px;
                font-style: italic;
               padding-top:30px;
                width: 400px;
                margin: 20px auto;
               
            }
            .background-circle {
                position: absolute;
                // background-color: rgba(63, 184, 232, 0.1); /* Transparent blue color */
                border-radius: 50%; /* Make it a circle */
                width: 200px; /* Adjust circle size */
                height: 200px; /* Adjust circle size */
                top: 50%; /* Position it in the middle vertically */
                left: 50%; /* Position it in the middle horizontally */
                transform: translate(-50%, -50%); /* Center the circle */
                opcaity:1;
            }
            
            .background-circle:nth-child(1) {
                width: 300px; /* Adjust size for the first circle */
                height: 300px; /* Adjust size for the first circle */
                top: 30%; /* Adjust position for the first circle */
                left: 30%; /* Adjust position for the first circle */
            }
            
            .background-circle:nth-child(2) {
                width: 250px; /* Adjust size for the second circle */
                height: 250px; /* Adjust size for the second circle */
                top: 70%; /* Adjust position for the second circle */
                left: 70%; /* Adjust position for the second circle */
            }
            
            .reason {
                margin-top: 56px;
                font-size: 58px;
            }
            /* CSS for triangles */
            body::before,
            body::after {
                content: '';
                position: absolute;
                top: 0;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 400px 200px 0; /* Adjust triangle size */
                border-color: transparent transparent  #2637ab transparent; /* Adjust triangle color */
            }

            body::before {
                left: 0;
            }

            body::after {
                right: 0;
                transform: rotate(180deg); /* Rotate triangle */
            }
            
        </style>
        </head>
        <body>
            <div class="container" style="border: 25px solid 
            #2637ab
            ; width: 1270px; height: 830px; display: table-cell; vertical-align: middle; position: relative; background-size: cover; background-position: center;
            
            
            ">
            <div class="background-circle"></div>
    <div class="background-circle"></div>
    <div class="background-circle"></div>
           

            <div class="marquee">
                Certificate of Completion
            </div>

            <div class="assignment">
                This certificate is proudly presented to
            </div>

            <div class="person">
                ${name}
            </div>

            <div class="reason">
                For Completing <b>IELTS AND SOFT SKILLS</b> course.
            </div>
        </div>
        </body>
        </html>
    `;
};

export default useTemplate;
