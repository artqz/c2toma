package quests.Q00001_LettersOfLove;

import org.l2jmobius.gameserver.model.actor.Npc;
import org.l2jmobius.gameserver.model.actor.Player;
import org.l2jmobius.gameserver.model.quest.Quest;
import org.l2jmobius.gameserver.model.quest.QuestState;
import org.l2jmobius.gameserver.model.quest.State;

public class _1_LettersOfLove extends Quest
{
	// NPCs
	private static final int DARIN = 30048;
	private static final int ROXXY = 30006;
	private static final int BAULRO = 30033;
	// Items
	private static final int DARIN_LETTER = 687;
	private static final int ROXXY_KERCHIEF = 688;
	private static final int DARIN_RECEIPT = 1079;
	private static final int BAULRO_POTION = 1080;
	// Reward
	private static final int NECKLACE = 906;
	
	public _1_LettersOfLove()
	{
		super(1);
		registerQuestItems(DARIN_LETTER, ROXXY_KERCHIEF, DARIN_RECEIPT, BAULRO_POTION);
		addStartNpc(DARIN);
		addTalkId(DARIN, ROXXY, BAULRO);
	}
	
	@Override
	public String onEvent(String event, Npc npc, Player player)
	{
		String htmltext = event;
		final QuestState st = getQuestState(player, false);
		if (st == null)
		{
			return htmltext;
		}
		
		if (event.equals("daring_q0001_06.htm"))
		{
			st.startQuest();
			giveItems(player, DARIN_LETTER, 1);
		}
		
		return htmltext;
	}
	
	@Override
	public String onTalk(Npc npc, Player player)
	{
		String htmltext = getNoQuestMsg(player);
		final QuestState st = getQuestState(player, true);
		
		switch (st.getState())
		{
			case State.CREATED:
			{
				htmltext = (player.getLevel() < 2) ? "daring_q0001_01.htm" : "daring_q0001_02.htm";
				break;
			}
			case State.STARTED:
			{
				final int cond = st.getCond();
				switch (npc.getId())
				{
					case DARIN:
					{
						if (cond == 1)
						{
							htmltext = "daring_q0001_07.htm";
						}
						else if (cond == 2)
						{
							htmltext = "daring_q0001_08.htm";
							st.setCond(3, true);
							takeItems(player, ROXXY_KERCHIEF, 1);
							giveItems(player, DARIN_RECEIPT, 1);
						}
						else if (cond == 3)
						{
							htmltext = "daring_q0001_09.htm";
						}
						else if (cond == 4)
						{
							htmltext = "daring_q0001_10.htm";
							takeItems(player, BAULRO_POTION, 1);
							giveItems(player, NECKLACE, 1);
							st.exitQuest(false, true);
						}
						break;
					}
					case ROXXY:
					{
						if (cond == 1)
						{
							htmltext = "rapunzel_q0001_01.htm";
							st.setCond(2, true);
							takeItems(player, DARIN_LETTER, 1);
							giveItems(player, ROXXY_KERCHIEF, 1);
						}
						else if (cond == 2)
						{
							htmltext = "rapunzel_q0001_02.htm";
						}
						else if (cond > 2)
						{
							htmltext = "rapunzel_q0001_03.htm";
						}
						break;
					}
					case BAULRO:
					{
						if (cond == 3)
						{
							htmltext = "baul_q0001_01.htm";
							st.setCond(4, true);
							takeItems(player, DARIN_RECEIPT, 1);
							giveItems(player, BAULRO_POTION, 1);
						}
						else if (cond == 4)
						{
							htmltext = "baul_q0001_02.htm";
						}
						break;
					}
				}
				break;
			}
			case State.COMPLETED:
			{
				htmltext = getAlreadyCompletedMsg(player);
				break;
			}
		}
		
		return htmltext;
	}
}