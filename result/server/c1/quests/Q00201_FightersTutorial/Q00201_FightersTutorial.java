package quests.Q00201_FightersTutorial;

import org.l2jmobius.gameserver.enums.ClassId;
import org.l2jmobius.gameserver.enums.QuestSound;
import org.l2jmobius.gameserver.model.actor.Npc;
import org.l2jmobius.gameserver.model.actor.Player;
import org.l2jmobius.gameserver.model.quest.Quest;
import org.l2jmobius.gameserver.model.quest.QuestState;
import org.l2jmobius.gameserver.model.quest.State;

public class Q00201_FightersTutorial extends Quest
{
	// NPCs
	private static final int CARL = 30009;
	private static final int ROIEN = 30008;
	// Items
	private static final int RECOMMENDATION = 1067;
	private static final int FOX_FANG = 1857;
	// Reward
	private static final int WORLD_MAP = 1665;
	// Kill
	private static final int TUTO_KELTIR = 30008;
	
	public Q00201_FightersTutorial()
	{
		super(201);
		registerQuestItems(RECOMMENDATION, FOX_FANG);
		addStartNpc(CARL);
		addTalkId(CARL, ROIEN);
		addKillId(TUTO_KELTIR);
	}

	public String onAdvEvent(String event, Npc npc, Player player)
	{
		String htmltext = event;
		final QuestState st = getQuestState(player, false);
		if (st == null)
		{
			return htmltext;
		}
		
		// if (event.equals("daring_q0001_06.htm"))
		// {
		// 	st.startQuest();
		// 	giveItems(player, DARIN_LETTER, 1);
		// }
		
		return htmltext;
	}

	public String onTalk(Npc npc, Player player) {
		String htmltext = getNoQuestMsg(player);
		final QuestState qs = getQuestState(player, true);

		switch (npc.getId()) {
			case CARL:
				if (qs.isCreated()) {
					if (player.getClassId() != ClassId.FIGHTER) {
						htmltext = "carl_q0201_06.htm";
						return htmltext;
					} else if (player.getLevel() >= 10) {
						htmltext = "carl_q0201_05.htm";
						return htmltext;
					} else {
//						htmltext = "carl_q0201_06.htm";
						qs.startQuest();
//						return htmltext;
					}
				} else if (qs.isStarted()) {
					htmltext = "carl_q0201_01.htm";
					return htmltext;
				}
		}

		return htmltext;
	}

//		switch (qs.getState())
//		{
//			case State.CREATED:
//			{
//				if (player.getClassId() == ClassId.FIGHTER)
//				{
//					htmltext = "carl_q0201_06.htm";
//					st.startQuest();
//				}
//				else if (player.getLevel() >= 10)
//				{
//					htmltext = "carl_q0201_05.htm";
//				}
//				else {
//					htmltext = "carl_q0201_01.htm";
//				}
//				break;
//			}
//			case State.STARTED:
//			{
//				final int cond = st.getCond();
//				switch (npc.getId())
//				{
//					case CARL:
//					{
//						if (cond == 2)
//						{
//							if (getQuestItemsCount(player, FOX_FANG) < 4)
//							{
//								htmltext = "carl_q0201_03.htm";
//							}
//							else
//							{
//								htmltext = "carl_q0201_02.htm";
//								st.setCond(3, true);
//								takeItems(player, FOX_FANG, 4);
//								giveItems(player, RECOMMENDATION, 1);
//								giveItems(player, WORLD_MAP, 1);
//							}
//						}
//						else if (cond == 3)
//						{
//							htmltext = "carl_q0201_04.htm";
//						}
//						break;
//					}
//					case ROIEN:
//					{
//						if (cond == 3)
//						{
//							htmltext = "roien_q0201_01.htm";
//							takeItems(player, RECOMMENDATION, 4);
//							addExpAndSp(player, 0, 50);
//							st.exitQuest(false, true);
//						}
//						break;
//					}
//				}
//				break;
//			}
//			case State.COMPLETED:
//			{
//				htmltext = getAlreadyCompletedMsg(player);
//				break;
//			}

		


	public String onKill(Npc npc, Player player, boolean isPet)
	{
		final QuestState st = getQuestState(player, false);
		if ((st == null) || !st.isStarted())
		{
			return null;
		}
		
		switch (npc.getId())
		{
			case TUTO_KELTIR:
			{
				if (st.isCond(1))
				{
					giveItems(player, FOX_FANG, 1);
					if (getQuestItemsCount(player, FOX_FANG) < 4)
					{
						playSound(player, QuestSound.ITEMSOUND_QUEST_ITEMGET);
					}
					else
					{
						st.setCond(2, true);
					}
				}
				break;
			}			
		}
		
		return null;
	}
}