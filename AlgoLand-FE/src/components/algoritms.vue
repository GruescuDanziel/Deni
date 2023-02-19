<template>
    
    <div id="mainContainer">

        <div id="navBar">

            <h1><router-link to="/notebook">Notebook</router-link></h1>
            <h1><router-link to="/editor">Editor</router-link></h1>
            <h1><router-link to="/algorithms">Algos</router-link></h1>

        </div>

        <div id="dataContainer">

            <div id="treeNavigator">
                <h1 @click="changeAlgorithm('recursiveTree')" class="treeNavigatorItem" >Recursive Tree</h1>
                <h1 @click="changeAlgorithm('LSystem')" class="treeNavigatorItem" >LSystem</h1>
            </div>

            <div id="dataPanel" :key="componentKey">
                <div v-if='currentAlgorithm == "recursiveTree"' class="AlgoWindow">
                    <recursiveTree :branches="this.branches"/>
                    <div class="AlgoText">
                        <h4>In graph theory, a recursive tree (i.e., unordered tree) is a labeled, rooted tree. A size-n recursive tree's vertices are labeled by distinct positive integers 1, 2, …, n, where the labels are strictly increasing starting at the root labeled 1. Recursive trees are non-planar, which means that the children of a particular vertex are not ordered; for example, the following two size-3 recursive trees are equivalent: 3/1\2 = 2/1\3.Recursive trees also appear in literature under the name Increasing Cayley trees. </h4>
                        <input id="treeInput" v-on:keyup.enter="calculateMaxBranches" >
                    </div>
                </div>
                <div v-if='currentAlgorithm == "LSystem"'>
                    <LSystem />
                </div>
            </div>


        </div>
    </div>

</template>

<style scoped>



#dataPanel, #p5Canvas{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
}

#mainContainer{

    background:#171D1C;
    display:flex;
    justify-content:space-between;
    align-items:center;
    height:100%;
    flex-direction:column;

}

#navBar{
    display:flex;
    width:100%;
    justify-content:space-between;
    border-bottom:#16BAC5 1px solid;
    margin-bottom:1%;
}

#navBar h1:not(:first-child){
    border-left:#16BAC5 1px solid;
}

#navBar h1{
    color:white;
    width:100%;
    text-align:center;
}

#navBar h1:hover{

    background:#16838A;
    color:black;
}

#dataContainer{

    overflow-y: hidden;
    background:#16838A;
    margin-top:1%;
    width:95%;
    height:90%;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

#treeNavigator{

    border-right:red 1px solid;
    width:11%;
    height:100%;
    padding-left:4%;
    display:flex;
    flex-direction: column;

}
.treeNavigatorItem{

    margin-bottom:5%;


}

a{

    color:white;
    text-decoration:none;

}
.AlgoText{
    overflow:scroll;
    position:absolute;
    top:15%;
    left:20%;
    height:80%;
    width:30%;
}
.AlgoWindow{

    display:flex;
    width:50%;

}

</style>

<script>
    import recursiveTree from "../sketches/recursiveTree.vue"
    import LSystem from "../sketches/LSystem.vue"

    export default{
        components: {
            recursiveTree,
            LSystem
        },

        data(){
            return{
                currentAlgorithm:"LSystem",
                componentKey: 0,
                branches: 2
            }
        },

        methods:{
            
            changeAlgorithm(nextAlgo){
                this.currentAlgorithm = nextAlgo;
                this.$forceUpdate();
                this.componentKey += 1;
            },
            calculateMaxBranches(){
                const numberOfBranches = document.getElementById("treeInput").value;
                this.branches = 250;
                for(let i = 0; i < numberOfBranches; i++){
                    this.branches = this.branches * 0.66;
                }
                    this.$forceUpdate();
                    this.componentKey += 1;

            }

        }
    }

</script>

