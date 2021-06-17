package com.yu;

public class GreetingDto {

    private int friendCount;
    private String message;
    private boolean accepted;

    public int getFriendCount() {
        return friendCount;
    }

    public void setFriendCount(int friendCount) {
        this.friendCount = friendCount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public GreetingDto() {
    }

    public GreetingDto(int friendCount, String message, boolean accepted) {
        this.friendCount = friendCount;
        this.message = message;
        this.accepted = accepted;
    }

}
