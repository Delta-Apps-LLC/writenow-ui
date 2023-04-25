CREATE TABLE "accounts" (
  "userid" SERIAL NOT NULL,
  "firstname" varchar(30) NOT NULL,
  "lastname" varchar(30) NOT NULL,
  "username" varchar(60) NOT NULL UNIQUE,
  "password" varchar(200) NOT NULL,
  "notif_time" text DEFAULT '12:00:00 GMT-0600 (Mountain Daylight Time)',
  PRIMARY KEY ("userid")
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);
CREATE INDEX "IDX_session_expire" ON "session" ("expire");


CREATE TABLE "topics" (
  "topicid" SERIAL NOT NULL,
  "topictext" varchar(30),
  PRIMARY KEY ("topicid")
);


CREATE TABLE "prompts" (
  "promptid" SERIAL NOT NULL,
  "prompttext" text NOT NULL,
  "topicid" SERIAL NOT NULL,
  PRIMARY KEY ("promptid"),
  FOREIGN KEY ("topicid") REFERENCES "topics" ("topicid")
);
CREATE INDEX "random_prompt" ON "prompts" ("promptid");


CREATE TABLE "active_prompt" (
	"promptid" INTEGER NOT NULL,
	"userid" SERIAL NOT NULL,
	"dateadded" TEXT NOT NULL,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);


CREATE TABLE "entries" (
  "entryid" SERIAL NOT NULL,
  "text" text NOT NULL,
  "date" timestamp NOT NULL,
  "promptid" INTEGER NOT NULL,
  "userid" SERIAL NOT NULL,
  PRIMARY KEY ("entryid"),
  FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);
create index "entries_userid" ON "entries" ("userid");


CREATE TABLE "shared_entries" (
	"entryid" SERIAL NOT NULL,
	"userid" SERIAL NOT NULL,
	"owner" SERIAL NOT NULL,
	FOREIGN KEY ("entryid") REFERENCES "entries" ("entryid") ON DELETE CASCADE,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE,
	FOREIGN KEY ("owner") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);
create index "shared_entries_userid" ON "shared_entries" ("userid");


CREATE TABLE "shared_prompts" (
	"promptid" INTEGER NOT NULL,
	"userid" SERIAL NOT NULL,
	"sender" SERIAL NOT NULL,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE,
	FOREIGN KEY ("sender") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);
create index "shared_prompts_userid" ON "shared_prompts" ("userid");


CREATE TABLE "notifications" (
  "notifid" SERIAL NOT NULL,
  "userid" INTEGER NOT NULL,
  "senderid" INTEGER NOT NULL,
  "sendername" text NOT NULL,
  "date" timestamp NOT NULL,
  "seen" boolean DEFAULT false,
  "journalid" INTEGER NOT NULL,
  "text" text NOT NULL,
  "title" text NOT NULL,
  PRIMARY KEY ("notifid")
);
create index "notifications_userid" ON "notifications" ("userid");


CREATE TABLE "group" (
  "groupid" SERIAL NOT NULL,
  "groupname" text NOT NULL,
  "joincode" text unique,
  PRIMARY KEY ("groupid")
);


CREATE TABLE "member" (
  "groupid" INTEGER NOT NULL,
  "userid" INTEGER NOT NULL,
  PRIMARY KEY ("groupid", "userid"),
  FOREIGN KEY ("userid") REFERENCES "accounts"("userid") ON DELETE CASCADE,
  FOREIGN KEY ("groupid") REFERENCES "group"("groupid") ON DELETE CASCADE
);


CREATE TABLE "group_active_prompt" (
	"promptid" INTEGER NOT NULL,
	"groupid" INTEGER NOT NULL,
	"dateadded" TEXT NOT NULL,
	FOREIGN KEY ("groupid") REFERENCES "group" ("groupid") ON DELETE CASCADE
);


INSERT INTO accounts (firstname, lastname, username, "password") values ('Andrew', 'Thibaudeau', 'a.thibs98@gmail.com', 'hellothere');


INSERT INTO topics (topictext) values('Gratitude');
INSERT INTO topics (topictext) values('Goals');
INSERT INTO topics (topictext) values('Self-awareness');


INSERT INTO prompts (topicid, prompttext) values(2, 'Describe 3 things that are on your bucket list.');
INSERT INTO prompts (topicid, prompttext) values(2, 'What do you hope to accomplish this week?');
INSERT INTO prompts (topicid, prompttext) values(3, 'What is your biggest motivator right now and why?');
INSERT INTO prompts (topicid, prompttext) values(3, 'Is there anything about your current mindset you want to change? Why or why not?');
INSERT INTO prompts (topicid, prompttext) values(1, 'Name three good things about your life today.');
INSERT INTO prompts (topicid, prompttext) values(1, 'Describe someone in your life you are grateful for right now and why.');
INSERT INTO prompts (topicid, prompttext) values(1, 'Explain something you have learned recently that you are grateful for.');

