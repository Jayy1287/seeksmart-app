import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { shouldShowToolLikeCounts } from "@/lib/feature-flags";
import { toPublicToolCard, toolCardInclude } from "@/server/tools/mappers";
import type {
  PublicToolCard,
  PublicToolCardWithLikeState,
  ToolLikeState
} from "@/shared/domain";

export type LikedTool = PublicToolCardWithLikeState & {
  likedAt: Date;
};

export async function attachToolLikeStates<T extends PublicToolCard>(
  tools: T[],
  userId?: string
): Promise<Array<T & PublicToolCardWithLikeState>> {
  const ids = [...new Set(tools.map((tool) => tool.id))];
  const states = await getToolLikeStates(ids, userId);

  return tools.map((tool) => ({
    ...tool,
    like: states.get(tool.id) ?? getEmptyLikeState()
  }));
}

export async function getToolLikeState(
  toolId: string,
  userId?: string
): Promise<ToolLikeState> {
  const states = await getToolLikeStates([toolId], userId);

  return states.get(toolId) ?? getEmptyLikeState();
}

export async function listLikedToolsForUser(
  userId: string
): Promise<LikedTool[]> {
  const likedTools = await prisma.toolLike.findMany({
    where: {
      userId,
      tool: {
        status: PublishStatus.PUBLISHED
      }
    },
    include: {
      tool: {
        include: toolCardInclude
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const toolsWithState = await attachToolLikeStates(
    likedTools.map((likedTool) => toPublicToolCard(likedTool.tool)),
    userId
  );

  return toolsWithState.map((tool, index) => ({
    ...tool,
    likedAt: likedTools[index]?.createdAt ?? new Date()
  }));
}

export async function countLikedToolsForUser(userId: string) {
  return prisma.toolLike.count({
    where: {
      userId,
      tool: {
        status: PublishStatus.PUBLISHED
      }
    }
  });
}

async function getToolLikeStates(
  toolIds: string[],
  userId?: string
): Promise<Map<string, ToolLikeState>> {
  const uniqueToolIds = [...new Set(toolIds)].filter(Boolean);
  const showCounts = shouldShowToolLikeCounts();

  if (uniqueToolIds.length === 0) {
    return new Map();
  }

  const [likeCounts, viewerLikes] = await Promise.all([
    showCounts
      ? prisma.toolLike.groupBy({
          by: ["toolId"],
          where: {
            toolId: {
              in: uniqueToolIds
            },
            tool: {
              status: PublishStatus.PUBLISHED
            }
          },
          _count: {
            _all: true
          }
        })
      : Promise.resolve([]),
    userId
      ? prisma.toolLike.findMany({
          where: {
            userId,
            toolId: {
              in: uniqueToolIds
            }
          },
          select: {
            toolId: true
          }
        })
      : Promise.resolve([])
  ]);

  const likedToolIds = new Set(viewerLikes.map((like) => like.toolId));
  const countByToolId = new Map(
    likeCounts.map((likeCount) => [likeCount.toolId, likeCount._count._all])
  );

  return new Map(
    uniqueToolIds.map((toolId) => [
      toolId,
      {
        count: showCounts ? countByToolId.get(toolId) ?? 0 : null,
        isLiked: likedToolIds.has(toolId)
      }
    ])
  );
}

function getEmptyLikeState(): ToolLikeState {
  return {
    count: shouldShowToolLikeCounts() ? 0 : null,
    isLiked: false
  };
}
