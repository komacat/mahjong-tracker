import { generateScoringSheet } from '$lib/scoring'
import { validateCaptcha } from '$lib/server/captcha'
import prisma from '$lib/server/prisma'
import { validateChonbo, validateScoring, validateUma } from '$lib/validator'
import {
    AllLastPolicy,
    EndgamePolicy,
    GameLength,
    MultiRonHonbaPolicy,
    MultiRonPotPolicy,
    Players,
    Record,
    RenchanPolicy,
    TiebreakerPolicy,
} from '@prisma/client'
import { error } from '@sveltejs/kit'

export const POST = async ({ request }) => {
    const data = await request.json()
    const parlorId = data.parlorId
    const rulesetId = data.rulesetId

    if (!validateCaptcha(data.token?.toString())) {
        error(400, 'Invalid captcha token')
    }

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const name = data.ruleset.name?.toString()

    if (!name || name.length < 3) {
        error(400, 'Name must be at least 3 characters long')
    }

    const player: Players = data.ruleset.player
    const length: GameLength = data.ruleset.length

    console.log(data.ruleset)

    const startScore = +(data.ruleset.startScore?.toString() ?? -1)

    if (startScore < 0) {
        error(400, 'Invalid staring score')
    }

    if (startScore % 100 !== 0) {
        error(400, 'Starting score must be a multiple of 100')
    }

    const returnScore = +(data.ruleset.returnScore?.toString() ?? -1)

    if (returnScore < 0) {
        error(400, 'Invalid return score')
    }

    if (returnScore % 100 !== 0) {
        error(400, 'Return score must be a multiple of 100')
    }

    if (returnScore < startScore) {
        error(400, 'Return score must be greater than or equal to starting score')
    }

    const uma = data.ruleset.uma ?? '{}'

    if (!uma) {
        error(400, 'Uma must be specified')
    }

    if (!validateUma(uma)) {
        error(400, 'Invalid uma')
    }

    const scoring = data.ruleset.scoring ?? '{}'

    if (!validateScoring(scoring)) {
        error(400, 'Invalid scoring')
    }

    const honba = +(data.ruleset.honba?.toString() ?? -1)

    if (honba < 0) {
        error(400, 'Honba cannot be negative')
    }

    if (
        (player === Players.FOUR && honba % 300 !== 0) ||
        (player === Players.THREE && scoring.tsumozon && honba % 300 !== 0)
    ) {
        error(400, 'Honba must be a multiple of 300')
    }

    if (player === Players.THREE && !scoring.tsumozon && honba % 200 !== 0) {
        error(400, 'Honba must be a multiple of 200')
    }

    const tenpaiFee = +(data.get('tenpai')?.toString() ?? -1)

    if (tenpaiFee < 0) {
        error(400, 'Tenpai fee cannot be negative')
    }

    if (player === Players.FOUR && tenpaiFee % 300 !== 0) {
        error(400, 'Tenpai fee must be a multiple of 300')
    }

    if (player === Players.THREE && tenpaiFee % 200 !== 0) {
        error(400, 'Tenpai fee must be a multiple of 200')
    }

    let endgamePot: EndgamePolicy

    switch (data.ruleset.endgame?.toString()) {
        case 'top':
            endgamePot = EndgamePolicy.TOP
            break
        case 'disappears':
            endgamePot = EndgamePolicy.DISAPPEARS
            break
        default:
            error(400, 'Invalid endgame policy')
    }

    let tiebreaker: TiebreakerPolicy

    switch (data.ruleset.tiebreaker?.toString()) {
        case 'wind':
            tiebreaker = TiebreakerPolicy.WIND
            break
        case 'split':
            tiebreaker = TiebreakerPolicy.SPLIT
            break
        default:
            error(400, 'Invalid tiebreaker policy')
    }

    let renchan: RenchanPolicy

    switch (data.ruleset.renchan?.toString()) {
        case 'tenpai':
            renchan = RenchanPolicy.TENPAI
            break
        case 'agari':
            renchan = RenchanPolicy.AGARI
            break
        case 'none':
            renchan = RenchanPolicy.NONE
            break
        case 'always':
            renchan = RenchanPolicy.ALWAYS
            break
        default:
            error(400, 'Invalid renchan policy')
    }

    let allLast: AllLastPolicy
    let allLastPlacement: number | null = null

    switch (data.ruleset.alllast?.toString()) {
        case 'agariyame':
            allLast = AllLastPolicy.AGARIYAME
            allLastPlacement = +(data.ruleset.alllastPlacement?.toString() ?? -1)
            break
        case 'tenpaiyame':
            allLast = AllLastPolicy.TENPAIYAME
            allLastPlacement = +(data.ruleset.alllastPlacement?.toString() ?? -1)
            break
        case 'none':
            allLast = AllLastPolicy.NONE
            break
        default:
            error(400, 'Invalid all last policy')
    }

    if (allLastPlacement !== null && allLastPlacement < 0) {
        error(400, 'Invalid all last placement')
    }

    const doubleRon = data.ruleset.doubleRon?.toString() === 'on'
    const tripleRon = data.ruleset.tripleRon?.toString() === 'on'
    let multiRonPotPolicy: MultiRonPotPolicy
    let multiRonHonbaPolicy: MultiRonHonbaPolicy

    switch (data.ruleset.multiRonPot?.toString()) {
        case 'atamahane':
            multiRonPotPolicy = MultiRonPotPolicy.ATAMAHANE
            break
        case 'split':
            multiRonPotPolicy = MultiRonPotPolicy.SPLIT
            break
        default:
            error(400, 'Invalid multi-ron pot policy')
    }

    switch (data.ruleset.multiRonHonba?.toString()) {
        case 'atamahane':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.ATAMAHANE
            break
        case 'split':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.SPLIT
            break
        case 'all':
            multiRonHonbaPolicy = MultiRonHonbaPolicy.ALL
            break
        default:
            error(400, 'Invalid multi-ron honba policy')
    }

    let record: Record

    switch (data.ruleset.record?.toString()) {
        case 'game':
            record = Record.GAME
            break
        case 'hand':
            record = Record.HAND
            break
        default:
            error(400, 'Invalid record policy')
    }

    const scoringSheet = generateScoringSheet(scoring)

    const nagashi = data.ruleset.nagashi?.toString()

    const nagashiScore = scoringSheet.dealer.tsumo.find(([name]) => name === nagashi)?.[1]

    if (nagashi == null || (nagashi !== 'none' && nagashiScore == null)) {
        error(400, 'Invalid nagashi')
    }

    const nagashiIsTsumo = data.ruleset.nagashiIsTsumo?.toString() === 'on'

    const chonbo = data.ruleset.chonbo ?? {}

    if (!validateChonbo(chonbo, scoringSheet)) {
        error(400, 'Invalid chonbo')
    }

    const suddenDeath =
        data.ruleset.suddenDeath?.toString() === 'on'
            ? +(data.get('suddenDeathPoint')?.toString() ?? -1)
            : null
    const calledGame =
        data.ruleset.calledGame?.toString() === 'on'
            ? +(data.get('calledGamePoint')?.toString() ?? -1)
            : null

    if (suddenDeath != null && suddenDeath < 0) {
        error(400, 'Invalid sudden death point')
    }

    if (calledGame != null && calledGame < 0) {
        error(400, 'Invalid called game point')
    }

    const ruleset = await prisma.ruleset.upsert({
        where: { id: rulesetId },
        create: {
            name,
            player,
            length,
            startScore,
            returnScore,
            uma,
            honba,
            tenpaiFee,
            endgamePot,
            tiebreaker,
            renchan,
            allLast,
            allLastPlacement,
            doubleRon,
            tripleRon,
            multiRonPotPolicy,
            multiRonHonbaPolicy,
            record,
            scores: scoringSheet,
            nagashi,
            nagashiIsTsumo,
            chonbo,
            oyaNagashi: data.ruleset.oyaNagashi?.toString() === 'on',
            tobi: data.ruleset.tobi?.toString() === 'on',
            tobiAtZero: data.ruleset.tobiAtZero?.toString() === 'on',
            riichiBelow1000: data.ruleset.riichiBelow1000?.toString() === 'on',
            suddenDeath,
            calledGame,
            note: data.ruleset.note?.toString() ?? '',
            parlorId,
        },
        update: {
            name,
            player,
            length,
            startScore,
            returnScore,
            uma,
            honba,
            tenpaiFee,
            endgamePot,
            tiebreaker,
            renchan,
            allLast,
            allLastPlacement,
            doubleRon,
            tripleRon,
            multiRonPotPolicy,
            multiRonHonbaPolicy,
            record,
            scores: scoringSheet,
            nagashi,
            nagashiIsTsumo,
            chonbo,
            oyaNagashi: data.ruleset.oyaNagashi?.toString() === 'on',
            tobi: data.ruleset.tobi?.toString() === 'on',
            tobiAtZero: data.ruleset.tobiAtZero?.toString() === 'on',
            riichiBelow1000: data.ruleset.riichiBelow1000?.toString() === 'on',
            suddenDeath,
            calledGame,
            note: data.ruleset.note?.toString() ?? '',
            parlorId,
        },
    })

    return new Response(JSON.stringify({ id: rulesetId }))
}
