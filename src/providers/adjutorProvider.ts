// src/providers/adjutorProvider.ts
import axios, { isAxiosError } from "axios";
import config from "../config/config";
import { AdjutorKarmaResponse } from "../types/express";

/**
 * Checks if a user is blacklisted via Adjutor API.
 * @param identity - Email, phone, or BVN
 * @returns {Promise<boolean>} - True if blacklisted, false otherwise
 */
export const checkBlacklistStatus = async (
  identity: string
): Promise<boolean> => {
  try {
    const { data } = await axios.get<AdjutorKarmaResponse>(
      `${config.adjutor.baseUrl}/verification/karma/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${config.adjutor.apiKey}`,
        },
      }
    );

    const karma = data.data;

    const isBlacklisted =
      !!karma?.karma_identity &&
      !!karma?.default_date &&
      karma?.amount_in_contention === "0.00" &&
      !!karma?.reason &&
      !!karma?.karma_type?.karma;

    return isBlacklisted;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error checking Adjutor blacklist:",
        error.response?.data || error.message
      );
    }
    return false; // Fail-safe: treat as not blacklisted on error
  }
};
