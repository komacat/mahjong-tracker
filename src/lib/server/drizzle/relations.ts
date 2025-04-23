import { relations } from 'drizzle-orm/relations'
import {
    parlor,
    parlorMember,
    event,
    ruleset,
    user,
    userToken,
    game,
    eventAttendee,
    gamePlayer,
} from './schema'

export const parlorMemberRelations = relations(parlorMember, ({ one }) => ({
    parlor: one(parlor, {
        fields: [parlorMember.parlorId],
        references: [parlor.id],
    }),
}))

export const parlorRelations = relations(parlor, ({ many }) => ({
    parlorMembers: many(parlorMember),
    events: many(event),
    rulesets: many(ruleset),
}))

export const eventRelations = relations(event, ({ one, many }) => ({
    parlor: one(parlor, {
        fields: [event.parlorId],
        references: [parlor.id],
    }),
    ruleset: one(ruleset, {
        fields: [event.rulesetId],
        references: [ruleset.id],
    }),
    games: many(game),
    eventAttendees: many(eventAttendee),
}))

export const rulesetRelations = relations(ruleset, ({ one, many }) => ({
    events: many(event),
    parlor: one(parlor, {
        fields: [ruleset.parlorId],
        references: [parlor.id],
    }),
}))

export const userTokenRelations = relations(userToken, ({ one }) => ({
    user: one(user, {
        fields: [userToken.userId],
        references: [user.id],
    }),
}))

export const userRelations = relations(user, ({ many }) => ({
    userTokens: many(userToken),
    eventAttendees: many(eventAttendee),
    gamePlayers: many(gamePlayer),
}))

export const gameRelations = relations(game, ({ one, many }) => ({
    event: one(event, {
        fields: [game.eventId],
        references: [event.id],
    }),
    gamePlayers: many(gamePlayer),
}))

export const eventAttendeeRelations = relations(eventAttendee, ({ one }) => ({
    user: one(user, {
        fields: [eventAttendee.userId],
        references: [user.id],
    }),
    event: one(event, {
        fields: [eventAttendee.eventId],
        references: [event.id],
    }),
}))

export const gamePlayerRelations = relations(gamePlayer, ({ one }) => ({
    user: one(user, {
        fields: [gamePlayer.userId],
        references: [user.id],
    }),
    game: one(game, {
        fields: [gamePlayer.gameId],
        references: [game.id],
    }),
}))
