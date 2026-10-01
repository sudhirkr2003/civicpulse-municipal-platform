package com.civicpulse.nexus.dto;

public class ShareLinkDTO {

    private String shareUrl;
    private String token;
    private String expiresAt;
    private String accessType;

    public ShareLinkDTO() {}

    public ShareLinkDTO(String shareUrl, String token, String expiresAt, String accessType) {
        this.shareUrl = shareUrl;
        this.token = token;
        this.expiresAt = expiresAt;
        this.accessType = accessType;
    }

    public String getShareUrl() { return shareUrl; }
    public void setShareUrl(String shareUrl) { this.shareUrl = shareUrl; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }
}
