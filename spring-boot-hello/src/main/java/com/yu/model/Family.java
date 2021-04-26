package com.yu.model;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "family")
public class Family implements IHasId {

    @Id
    @Column(name = "Id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "Version", nullable = false)
    @Version
    private int version;

    @Column(name = "creation_date", nullable = false)
    private Instant creationDate;

    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;

    @NotNull
    @ManyToOne(targetEntity = People.class)
    @JoinColumn(name = "father_id")
    private People father;

    @NotNull
    @ManyToOne(targetEntity = People.class)
    @JoinColumn(name = "mother_id")
    private People mother;

    @ManyToMany()
    @JoinTable(name="family_child",
            joinColumns = @JoinColumn(name="family_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name="child_id", referencedColumnName = "id")
    )
    private List<People> children = new ArrayList<>();

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

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public People getFather() {
        return father;
    }

    public void setFather(People father) {
        this.father = father;
    }

    public People getMother() {
        return mother;
    }

    public void setMother(People mother) {
        this.mother = mother;
    }

    public List<People> getChildren() {
        return children;
    }

    public void setChildren(List<People> children) {
        this.children = children;
    }

}
