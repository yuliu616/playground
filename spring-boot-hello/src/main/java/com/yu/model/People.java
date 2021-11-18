package com.yu.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "ppl_people")
public class People implements IHasId {

    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "Version", nullable = false)
    @Version
    private int version;

    @CreatedDate
    @Column(name = "creation_date", nullable = false)
    private Instant creationDate;

    @LastModifiedDate
    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;

    /**
     * a person that is inactive means we ignore him/her,
     * it may because we dont care, or he/she is already dead.
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    /**
     * name that you call a friend
     */
    @Column(name = "nickname", nullable = true)
    private String nickname;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = true)
    private Gender gender;

    /**
     * date that this person born, including year,
     * local to where he/she was born.
     */
    @Column(name = "date_of_birth", nullable = true)
    private LocalDate dateOfBirth;

    /**
     * for eastern people, 'family name' that common to all children within a family.
     */
    @NotBlank
    @Column(name = "first_name", nullable = true)
    private String firstName;

    /**
     * for western people, 'family name' that common to all children within a family.
     */
    @NotBlank
    @Column(name = "last_name", nullable = true)
    private String lastName;

    @DecimalMin("0.01")
    @Column(name = "height_in_cm", nullable = true)
    private BigDecimal heightInCm;

    @Column(name = "weight_in_kg", nullable = true)
    private BigDecimal weightInKg;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getVersion() {
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
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

    public BigDecimal getHeightInCm() {
        return heightInCm;
    }

    public void setHeightInCm(BigDecimal heightInCm) {
        this.heightInCm = heightInCm;
    }

    public BigDecimal getWeightInKg() {
        return weightInKg;
    }

    public void setWeightInKg(BigDecimal weightInKg) {
        this.weightInKg = weightInKg;
    }
}
