# Security

* you build it
* you secure it
* you run it

## OWASP

* [Atacks](https://www.owasp.org/index.php/Category:Attack)
* [OWASP Zed Attack Proxy Tool](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project)
* [OWASP DevGuide](https://github.com/OWASP/DevGuide)

The Open Web Application Security Project[owasp] (OWASP) is a free and open worldwide community focused on improving the security of application software.

OWASP has listed the top ten security issues that put web applications at risk. That list is reproduced here, along with a description of how each issue should be addressed:

"Cross Site Scripting (XSS): XSS flaws occur whenever an application takes user supplied data and sends it to a web browser without first validating or encoding that content. XSS allows attackers to execute scripts in the victim's browser which can hijack user sessions, deface web sites, possibly introduce worms, etc."

* By default, escape all variables rendered in the view, preventing XSS.

"Injection Flaws: Injection flaws, particularly SQL injection, are common in web applications. Injection occurs when user-supplied data is sent to an interpreter as part of a command or query. The attacker's hostile data tricks the interpreter into executing unintended commands or changing data."

* Ensuring that all inserted data are properly escaped.

"Malicious File Execution: Code vulnerable to remote file inclusion (RFI) allows attackers to include hostile code and data, resulting in devastating attacks, such as total server compromise."

* Allow only exposed functions to be executed, preventing malicious file execution. Never expose imported functions; only actions.

"Insecure Direct Object Reference: A direct object reference occurs when a developer exposes a reference to an internal implementation object, such as a file, directory, database record, or key, as a URL or form parameter. Attackers can manipulate those references to access other objects without authorization."

* Don't expose any internal objects; moreover, if possible validate all URLs, thus preventing directory traversal attacks. Provide a simple mechanism to create forms that automatically validate all input values.

"Cross Site Request Forgery (CSRF): A CSRF attack forces a logged-on victim's browser to send a pre-authenticated request to a vulnerable web application, which then forces the victim's browser to perform a hostile action to the benefit of the attacker. CSRF can be as powerful as the web application that it attacks."

* Prevent CSRF as well as accidental double submission of forms by assigning a one-time random token to each form. Moreover, we can use UUID for session cookie.

"Information Leakage and Improper Error Handling: Applications can unintentionally leak information about their configuration, internal workings, or violate privacy through a variety of application problems. Attackers use this weakness to steal sensitive data, or conduct more serious attacks." 

* We could includes a ticketing system. No error can result in code being exposed to the users. All errors are logged and a ticket is issued to the user that allows error tracking. But errors and source code are accessible only to the administrator.

"Broken Authentication and Session Management: Account credentials and session tokens are often not properly protected. Attackers compromise passwords, keys, or authentication tokens to assume other users' identities."

* Provide a built-in mechanism for administrator authentication, and manage sessions independently for each application. The administrative interface should also force the use of secure session cookies when the client is not "localhost". For applications, it includes a powerful Role Based Access Control API.

"Insecure Cryptographic Storage: Web applications rarely use cryptographic functions properly to protect data and credentials. Attackers use weakly protected data to conduct identity theft and other crimes, such as credit card fraud."

* Use the MD5 or the HMAC+SHA-512 hash algorithms to protect stored passwords. Other algorithms are also available.

"Insecure Communications: Applications frequently fail to encrypt network traffic when it is necessary to protect sensitive communications."

* Use SSL encryption of communications.

"Failure to Restrict URL Access: Frequently an application only protects sensitive functionality by preventing the display of links or URLs to unauthorized users. Attackers can use this weakness to access and perform unauthorized operations by accessing those URLs directly."

* Use a mechanism for declaring which functions are public and which require authentication and authorization. This includes Role Based Access Control API that allows developers to restrict access to any function based on login, group membership or group based permissions. The permissions should be very granular and can be combined with database filters to allow, for example, to give access to specific tables and/or records. Also, would be ideal to allow digitally signed URL and provides API to digitally sign Ajax callbacks.

## Serverless

[Serverless plugin for least privileges](https://github.com/puresec/serverless-puresec-cli)

### Good idea, still not there for all services!

* Saves you time - magically creates IAM roles for you
* Reduces the attack surface of your AWS Lambda based application
* Helps create least privileged roles with the minimum required permissions
* Currently supported runtimes: Node.js, Python (more runtimes coming soon...)
* Currently supported services: DynamoDB, Kinesis, KMS, Lambda, S3, SES, SNS & Step Functions

[Snyk](https://snyk.io/)

### Testing Open Source projects is FREE

* Find vulnerabilities in your repos and remediate risks with automated updates and patches. Block vulnerable libraries in CI/CD and monitor PaaS/Serverless apps for dependency flaws.
