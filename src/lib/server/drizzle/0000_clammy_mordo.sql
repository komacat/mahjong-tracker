-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."AllLastPolicy" AS ENUM('AGARIYAME', 'TENPAIYAME', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."EndgamePolicy" AS ENUM('DISAPPEARS', 'TOP');--> statement-breakpoint
CREATE TYPE "public"."EventJoinRequestStatus" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."GameLength" AS ENUM('HANCHAN', 'TONPU');--> statement-breakpoint
CREATE TYPE "public"."MultiRonHonbaPolicy" AS ENUM('ATAMAHANE', 'SPLIT', 'ALL');--> statement-breakpoint
CREATE TYPE "public"."MultiRonPotPolicy" AS ENUM('ATAMAHANE', 'SPLIT');--> statement-breakpoint
CREATE TYPE "public"."Players" AS ENUM('FOUR', 'THREE');--> statement-breakpoint
CREATE TYPE "public"."Record" AS ENUM('GAME', 'HAND');--> statement-breakpoint
CREATE TYPE "public"."RenchanPolicy" AS ENUM('NONE', 'TENPAI', 'AGARI', 'ALWAYS');--> statement-breakpoint
CREATE TYPE "public"."TiebreakerPolicy" AS ENUM('SPLIT', 'WIND');--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Parlor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"owner" text NOT NULL,
	"website" text,
	"note" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ParlorMember" (
	"id" serial PRIMARY KEY NOT NULL,
	"parlorId" integer NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"parlorId" integer NOT NULL,
	"rulesetId" integer NOT NULL,
	"joinPolicy" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar" text,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserToken" (
	"sessionId" text PRIMARY KEY NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Ruleset" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"startScore" integer NOT NULL,
	"returnScore" integer NOT NULL,
	"uma" jsonb NOT NULL,
	"honba" integer NOT NULL,
	"tenpaiFee" integer NOT NULL,
	"endgamePot" "EndgamePolicy" NOT NULL,
	"tiebreaker" "TiebreakerPolicy" NOT NULL,
	"renchan" "RenchanPolicy" NOT NULL,
	"allLast" "AllLastPolicy" NOT NULL,
	"doubleRon" boolean NOT NULL,
	"tripleRon" boolean NOT NULL,
	"nagashi" text NOT NULL,
	"nagashiIsTsumo" boolean NOT NULL,
	"oyaNagashi" boolean NOT NULL,
	"suddenDeath" integer,
	"tobi" boolean NOT NULL,
	"tobiAtZero" boolean NOT NULL,
	"calledGame" integer,
	"riichiBelow1000" boolean NOT NULL,
	"scores" jsonb NOT NULL,
	"note" text NOT NULL,
	"parlorId" integer NOT NULL,
	"allLastPlacement" integer,
	"multiRonHonbaPolicy" "MultiRonHonbaPolicy" NOT NULL,
	"multiRonPotPolicy" "MultiRonPotPolicy" NOT NULL,
	"length" "GameLength" NOT NULL,
	"player" "Players" NOT NULL,
	"record" "Record" NOT NULL,
	"chonbo" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Game" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventId" integer NOT NULL,
	"startTime" timestamp(3),
	"durationSeconds" integer NOT NULL,
	"actions" jsonb NOT NULL,
	"name" text NOT NULL,
	"table" integer NOT NULL,
	"timer" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EventAttendee" (
	"userId" text NOT NULL,
	"eventId" integer NOT NULL,
	"status" "EventJoinRequestStatus" NOT NULL,
	CONSTRAINT "EventAttendee_pkey" PRIMARY KEY("userId","eventId")
);
--> statement-breakpoint
CREATE TABLE "GamePlayer" (
	"gameId" integer NOT NULL,
	"userId" text NOT NULL,
	"index" integer NOT NULL,
	CONSTRAINT "GamePlayer_pkey" PRIMARY KEY("gameId","userId")
);
--> statement-breakpoint
ALTER TABLE "ParlorMember" ADD CONSTRAINT "ParlorMember_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "public"."Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "public"."Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "public"."Ruleset"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "public"."Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Game" ADD CONSTRAINT "Game_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE cascade;
*/