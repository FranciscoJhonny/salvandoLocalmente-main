import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import NotaEditor from "./src/componentes/NotaEditor";
import { useEffect, useState } from "react";
import { Nota } from "./src/componentes/Nota";
import { buscaNotas, criaTabela,filtraPorCategoria  } from "./src/servicos/Notas";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  useEffect(() => {
    criaTabela();
    mostraNotas();
  }, []);

  const [categoria, setCategoria] = useState("Todos");
  const [notaSelecionada, setNotaSelecionada] = useState({});

  const [notas, setNotas] = useState([]);

  async function mostraNotas() {
    const todasNotas = await buscaNotas();
    setNotas(todasNotas);
  }

  async function filtraLista(categoriaSelecionada) {
    setCategoria(categoriaSelecionada)
    if(categoriaSelecionada == "Todos") {
      mostraNotas()
    } else {
      setNotas(await filtraPorCategoria(categoriaSelecionada))
    }
  }
  
  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.picker}>
        <Picker
          selectedValue={categoria}
          onValueChange={(novaCategoria) => filtraLista(novaCategoria)}
        >
          
          <Picker.Item label="Todos" value="Todos" />
          <Picker.Item label="Pessoal" value="Pessoal" />
          <Picker.Item label="Trabalho" value="Trabalho" />
          <Picker.Item label="Outros" value="Outros" />
        </Picker>
      </View>
      <FlatList
        data={notas}
        renderItem={(nota) => (
          <Nota {...nota} setNotaSelecionada={setNotaSelecionada} />
        )}
        keyExtractor={(nota) => nota.id}
      />
      <NotaEditor
        mostraNotas={mostraNotas}
        notaSelecionada={notaSelecionada}
        setNotaSelecionada={setNotaSelecionada}
      />
      <StatusBar />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
  },
});
