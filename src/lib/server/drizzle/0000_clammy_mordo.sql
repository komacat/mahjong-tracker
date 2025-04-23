DO $$ BEGIN
    CREATE TYPE AllLastPolicy AS ENUM('AGARIYAME', 'TENPAIYAME', 'NONE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE EndgamePolicy AS ENUM('DISAPPEARS', 'TOP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE EventJoinRequestStatus AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE GameLength AS ENUM('HANCHAN', 'TONPU');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE MultiRonHonbaPolicy AS ENUM('ATAMAHANE', 'SPLIT', 'ALL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE MultiRonPotPolicy AS ENUM('ATAMAHANE', 'SPLIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE Players AS ENUM('FOUR', 'THREE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE Record AS ENUM('GAME', 'HAND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE RenchanPolicy AS ENUM('NONE', 'TENPAI', 'AGARI', 'ALWAYS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE TiebreakerPolicy AS ENUM('SPLIT', 'WIND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "Parlor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"owner" text NOT NULL,
	"website" text,
	"note" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ParlorMember" (
	"id" serial PRIMARY KEY NOT NULL,
	"parlorId" integer NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"parlorId" integer NOT NULL,
	"rulesetId" integer NOT NULL,
	"joinPolicy" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar" text,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserToken" (
	"sessionId" text PRIMARY KEY NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Ruleset" (
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
CREATE TABLE IF NOT EXISTS "Game" (
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
CREATE TABLE IF NOT EXISTS "EventAttendee" (
	"userId" text NOT NULL,
	"eventId" integer NOT NULL,
	"status" "EventJoinRequestStatus" NOT NULL,
	CONSTRAINT "EventAttendee_pkey" PRIMARY KEY("userId","eventId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GamePlayer" (
	"gameId" integer NOT NULL,
	"userId" text NOT NULL,
	"index" integer NOT NULL,
	CONSTRAINT "GamePlayer_pkey" PRIMARY KEY("gameId","userId")
);
--> statement-breakpoint
ALTER TABLE "ParlorMember" DROP CONSTRAINT IF EXISTS "ParlorMember_parlorId_fkey";
ALTER TABLE "ParlorMember" ADD CONSTRAINT "ParlorMember_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_parlorId_fkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_rulesetId_fkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "UserToken" DROP CONSTRAINT IF EXISTS "UserToken_userId_fkey";
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "Ruleset" DROP CONSTRAINT IF EXISTS "Ruleset_parlorId_fkey";
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_parlorId_fkey" FOREIGN KEY ("parlorId") REFERENCES "Parlor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "Game" DROP CONSTRAINT IF EXISTS "Game_eventId_fkey";
ALTER TABLE "Game" ADD CONSTRAINT "Game_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "EventAttendee" DROP CONSTRAINT IF EXISTS "EventAttendee_userId_fkey";
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "EventAttendee" DROP CONSTRAINT IF EXISTS "EventAttendee_eventId_fkey";
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "GamePlayer" DROP CONSTRAINT IF EXISTS "GamePlayer_userId_fkey";
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

ALTER TABLE "GamePlayer" DROP CONSTRAINT IF EXISTS "GamePlayer_gameId_fkey";
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE cascade ON UPDATE cascade;
