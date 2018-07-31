export default {
	/* No usado en la demo
	s3: {
		REGION: "YOUR_S3_UPLOADS_BUCKET_REGION",
		BUCKET: "YOUR_S3_UPLOADS_BUCKET_NAME"
	},*/
	MAX_ATTACHMENT_SIZE: 5000000,	
	apiGateway: {
		REGION: "us-east-1",
		URL: "https://7f8p82nr44.execute-api.us-east-1.amazonaws.com/DEV"
	},
	cognito: {
		REGION: "us-east-1",
		USER_POOL_ID: "us-east-1_FGOxZmmBu",
		APP_CLIENT_ID: "k73n5117odejocpgonhb4jb8g",
		IDENTITY_POOL_ID: "us-east-1:545bae22-4219-4909-8712-3a92acf0c2ed"
	}
};