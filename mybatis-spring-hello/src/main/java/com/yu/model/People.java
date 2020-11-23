package com.yu.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class People implements IHasId {

    private long id;

    private int version = 0;

    private Instant creationDate;

    private Instant lastUpdated;

    private String firstName;

    private String lastName;

    private String nickname;

    private Gender gender;

    private LocalDate dateOfBirth;

    private BigDecimal weightInKg;

    private Long bornFamilyId;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public BigDecimal getWeightInKg() {
        return weightInKg;
    }

    public void setWeightInKg(BigDecimal weightInKg) {
        this.weightInKg = weightInKg;
    }

    public Long getBornFamilyId() {
        return bornFamilyId;
    }

    public void setBornFamilyId(Long bornFamilyId) {
        this.bornFamilyId = bornFamilyId;
    }
}
